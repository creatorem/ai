type NativeFile = File & { uri?: string };

export const uriToFile = async (
  uri: string,
  name: string,
  type: string,
): Promise<NativeFile> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const file = new File([blob], name, { type }) as NativeFile;
  file.uri = uri;
  return file;
};
