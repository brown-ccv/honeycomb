const SerialPort = require("serialport");

// TODO @brown-ccv #460: Test connections with MockBindings (e.g. CONTINUE_ANYWAY)  https://serialport.io/docs/api-binding-mock

/**
 * Retrieve's a serial port device based on either the COM name or product identifier
 * If productID is undefined then comVendorName is the COM name, otherwise it's the vendorID
 * @param {Array} portList A list of available serial port devices
 * @param {string} comVendorName EITHER a com name or the vendor identifier of the desired device
 * @param {string | undefined} productId The product identifier of the desired device
 * @returns The SerialPort device
 */
function getDevice(portList, comVendorName, productId) {
  if (productId === undefined) {
    const comName = comVendorName;
    return portList.filter(
      // Find the device with the matching comName
      (device) => device.path === comName.toUpperCase() || device.path === comName
    );
  } else {
    const vendorId = comVendorName;
    return portList.filter(
      // Find the device with the matching vendorId and productId
      (device) =>
        (device.vendorId === vendorId.toUpperCase() || device.vendorId === vendorId) &&
        device.productId === productId
    );
  }
}

/**
 * Retrieve's a serial port device based on either the COM name or product identifier
 * Returns false if the desired device was not found
 * @param {string} comVendorName EITHER a com name or the vendor identifier of the desired device
 * @param {string | undefined} productId The product identifier of the desired device
 * @returns The SerialPort device
 */
// TODO @brown-ccv #460: This should fail, not return false
async function getPort(comVendorName, productId) {
  let portList;
  try {
    portList = await SerialPort.list();
  } catch {
    return false;
  }

  const device = getDevice(portList, comVendorName, productId);
  try {
    const path = device[0].path;
    const port = new SerialPort({ path: path });
    return port;
  } catch {
    return false;
  }
}

/**
 * Sends event code data to a serial port device
 * @param {SerialPort} port A SerialPort device
 * @param {number} event_code The numeric code to write to the device
 */
async function sendToPort(port, event_code) {
  port.write(Buffer.from([event_code]));
}

module.exports = {
  getPort,
  sendToPort,
};
