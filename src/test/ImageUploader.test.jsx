import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from './render';
import ImageUploader, { resolveImageUrl } from '../admin/ImageUploader';

vi.mock('../api', () => {
  return {
    default: {
      post: vi.fn(),
      defaults: { baseURL: 'http://localhost:5000/api' },
    },
  };
});

import api from '../api';

function makeFile(name = 'test.png', size = 1024, type = 'image/png') {
  const blob = new Blob([new Uint8Array(size)], { type });
  blob.name = name;
  return blob;
}

describe('ImageUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolveImageUrl returns absolute URLs as-is', () => {
    expect(resolveImageUrl('https://cdn.example.com/x.jpg')).toBe('https://cdn.example.com/x.jpg');
    expect(resolveImageUrl('http://example.com/x.jpg')).toBe('http://example.com/x.jpg');
  });

  it('resolveImageUrl keeps /uploads/ relative', () => {
    expect(resolveImageUrl('/uploads/abc.jpg')).toBe('/uploads/abc.jpg');
  });

  it('resolveImageUrl handles empty values', () => {
    expect(resolveImageUrl('')).toBe('');
    expect(resolveImageUrl(null)).toBe('');
    expect(resolveImageUrl(undefined)).toBe('');
  });

  it('uploads a file via api.post with FormData (no manual Content-Type)', async () => {
    api.post.mockResolvedValue({ data: { url: '/uploads/abc.png' } });
    const onChange = vi.fn();

    render(<ImageUploader id="x" value="" onChange={onChange} />);

    const file = makeFile('test.png', 2048, 'image/png');
    const fileInput = document.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('/uploads/abc.png'));

    expect(api.post).toHaveBeenCalledTimes(1);
    const [url, form] = api.post.mock.calls[0];
    expect(url).toBe('/upload');
    expect(form).toBeInstanceOf(FormData);
    const passedConfig = api.post.mock.calls[0][2];
    expect(passedConfig).toBeUndefined();
  });

  it('shows an error when the file is too large', async () => {
    const onChange = vi.fn();
    render(<ImageUploader id="x" value="" onChange={onChange} />);

    const big = makeFile('big.png', 6 * 1024 * 1024, 'image/png');
    const fileInput = document.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [big] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/too large/i);
    });
    expect(api.post).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('surfaces a friendly error for 401', async () => {
    api.post.mockRejectedValue({ response: { status: 401, data: { error: 'No token' } } });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onChange = vi.fn();

    render(<ImageUploader id="x" value="" onChange={onChange} />);

    const file = makeFile();
    const fileInput = document.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/not logged in/i);
    });
    expect(onChange).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('surfaces a friendly error for 403', async () => {
    api.post.mockRejectedValue({ response: { status: 403, data: { error: 'Invalid CSRF' } } });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ImageUploader id="x" value="" onChange={() => {}} />);

    const file = makeFile();
    const fileInput = document.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/permission denied/i);
    });
    errSpy.mockRestore();
  });

  it('shows a preview when value is set', () => {
    render(<ImageUploader id="x" value="/uploads/abc.png" onChange={() => {}} />);
    const img = screen.getByAltText('Preview');
    expect(img).toHaveAttribute('src', '/uploads/abc.png');
  });

  it('does not show a preview when value is empty', () => {
    render(<ImageUploader id="x" value="" onChange={() => {}} />);
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('opens the file picker when Upload is clicked', () => {
    render(<ImageUploader id="x" value="" onChange={() => {}} />);
    const fileInput = document.querySelector('input[type="file"]');
    const clickSpy = vi.spyOn(fileInput, 'click');
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('resets the file input value after upload', async () => {
    api.post.mockResolvedValue({ data: { url: '/uploads/x.png' } });
    const onChange = vi.fn();
    render(<ImageUploader id="x" value="" onChange={onChange} />);

    const fileInput = document.querySelector('input[type="file"]');
    const setValue = vi.fn();
    Object.defineProperty(fileInput, 'files', { value: [makeFile()] });
    Object.defineProperty(fileInput, 'value', { set: setValue, get: () => '', configurable: true });
    fireEvent.change(fileInput);

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(setValue).toHaveBeenCalledWith('');
  });
});
