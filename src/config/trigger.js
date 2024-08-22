import settings from "./settings.json"; // includes event codes for each event

// TODO @brown-ccv #333: Nest this data under "trigger_box" equipment in config.json

// teensyduino
export const vendorID = "16c0";

// Default if process.env.EVENT_MARKER_PRODUCT_ID is not set
// export const productID = process.env.EVENT_MARKER_PRODUCT_ID || "";
export const productID = import.meta.env.EVENT_MARKER_PRODUCT_ID || "";

// Default if process.env.EVENT_MARKER_COM_NAME is not set
// export const comName = process.env.EVENT_MARKER_COM_NAME || "COM3";
export const comName = import.meta.env.EVENT_MARKER_COM_NAME || "COM3";

// TODO: We should think of a cleaner way of exporting all this
export const trigger = {
  vendorID,
  productID,
  comName,
  settings,
};
