# Print Server for NEVERBE-POS

This Print Server allows invoices to be printed directly from the NEVERBE-POS application using ESC/POS commands. It is designed to run on a local machine and facilitates communication between the POS system and a thermal printer.

## Features
- Supports ESC/POS commands for printing.
- Compatible with USB thermal printers (e.g., XP-58iih, 58mm).
- Lightweight and easy to set up.
- Runs locally to ensure privacy and low-latency printing.

## Requirements
- Node.js (v16 or later)
- NPM or Yarn
- Compatible thermal printer (tested with XP-58iih)
- NEVERBE-POS application

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/HewageNKM/NEVERBE-POS-Local-Server.git
   ```
2. Navigate to the project directory:
   ```bash
   cd print-server
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
## Usage
1. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```
2. The server will listen for incoming print requests on the specified port (default: `4444`).
3. Integrate the NEVERBE-POS application to send print requests to the server.

## API Endpoints
### POST /print
- **Description:** Sends a print job to the connected printer.
- **Request Body:**
  ```json
  {
    "order": {
      "orderId": "12345",
      "createdAt": "2024-12-26",
      "items": [
        {
          "name": "Product A",
          "variantName": "Red",
          "size": "M",
          "quantity": 2,
          "price": 500
        },
        {
          "name": "Product B",
          "variantName": "Blue",
          "size": "L",
          "quantity": 1,
          "price": 800
        }
      ],
      "paymentReceived": [
        {"amount": 2000}
      ]
    }
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "Print job sent"
  }
  ```

### GET /drawer
- **Description:** Opens the cash drawer connected to the printer.
- **Response:**
  ```json
  {
    "status": "success"
  }
  ```

## Testing
- Use tools like Postman or curl to test the `/print` endpoint.
  Example:
  ```bash
  curl -X POST http://localhost:4444/print \
       -H "Content-Type: application/json" \
       -d '{"order": {"orderId": "12345", "createdAt": "2024-12-26", "items": [{"name": "Product A", "variantName": "Red", "size": "M", "quantity": 2, "price": 500}, {"name": "Product B", "variantName": "Blue", "size": "L", "quantity": 1, "price": 800}], "paymentReceived": [{"amount": 2000}]}}'
  ```

## Troubleshooting
- Ensure the printer is properly connected and turned on.
- For Linux and Windows install libusb and Zadig drivers respectively.
- Check that the printer drivers are installed correctly on the local machine.
- Check the server logs for any errors.

## Future Improvements
- Add support for network printers.
- Provide a web interface for managing print jobs.
- Include pre-defined templates for invoices.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
