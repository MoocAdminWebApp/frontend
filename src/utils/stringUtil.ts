/**
 * Used to determine whether a string is a Base64 data URL
 * @param str character string
 * @returns
 */
export const isBase64DataURL = (str: string): boolean => {
  // Data URL regular expression
  const dataUrlRegex = /^data:([a-zA-Z]+\/[a-zA-Z]+);base64,(.*)$/;
  const match = str.match(dataUrlRegex);

  //If the match is successful
  if (match) {
    const base64Data = match[2]; //Extract Base64 section
    const base64Regex =
      /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    return base64Regex.test(base64Data);
  }

  return false;
};

/**
 * Ensure that the string str ends
 * @param str
 * @returns
 */
export const ensureTrailingSlash = (str: string): string => {
  if (str === "") return "/";
  return str.endsWith("/") ? str : str + "/";
};

/**
 * Replace the HTTP image with base64
 * @param url
 * @returns
 */
export const imageHttpUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          // Remove data: [IME type]; base64,  prefix
          const pureBase64 = reader.result.split(",")[1];
          resolve(pureBase64);
        } else {
          reject(new Error("Failed to convert Blob to Base64"));
        }
      };
      reader.onerror = () => {
        reject(new Error("FileReader error"));
      };
      reader.readAsDataURL(blob);
    });

    return base64;
  } catch (error) {
    console.error("Error converting image URL to Base64:", error);
    throw error;
  }
};

