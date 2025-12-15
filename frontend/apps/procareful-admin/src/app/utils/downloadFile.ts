export const downloadFile = (data: Blob | string, fileName: string) => {
  const isBlob = typeof data !== 'string';
  const url = isBlob ? window.URL.createObjectURL(data) : data;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // If the URL was created from a Blob, revoke it to free up resources
  if (isBlob) {
    window.URL.revokeObjectURL(url);
  }
};
