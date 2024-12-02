'use strict';
let bodyParser = require('body-parser')
let app = require('express')()
let http = require('http').Server(app)
let cors = require('cors')
app.use(cors())
app.use(bodyParser.json())

const port = 4444;

app.post('/print', async (req, res) => {
    const order = req.body;
    if (!order || !order.items) {
        return res.status(400).json({status: 'error', message: 'Invalid order data'});
    }

    try {
        const escpos = require('escpos')
        escpos.USB = require('escpos-usb')
        const device = new escpos.USB();
        const options = {encoding: "GB18030"}
        const printer = new escpos.Printer(device, options)


        device.open(function () {
            // Header section with bold
            printer
                .cashdraw(2)
                .font('a') // Use default font
                .align('ct') // Center alignment for header
                .style('b') // Bold for header
                .size(0.5, 0.5) // Smaller font size for header
                .text('NEVERBE')
                .text('New Kandy Road, Delgoda')
                .text('+9472624999 +9470528999')
                .text('support@neverbe.lk')
                .text('--------------------------------') // Separator

            // Switch back to default style and size for the rest of the content
            printer
                .align('lt') // Left align for details
                .style('') // Revert to default style
                .size(0.5, 0.5) // Default font size
                .text(`Date: ${order.createdAt}`)
                .text(`Order #: ${order.orderId}`)
                .text('--------------------------------'); // Separator

            // Print each item
            order.items.forEach((item) => {
                printer
                    .text(`${item.name} ${item.variantName} (${item.size})`)
                    .text(`  Qty: ${item.quantity} x Price: ${item.price} = ${item.quantity * item.price}`);
            });

            // Print totals
            const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            printer
                .text('--------------------------------') // Separator
                .align('rt') // Right align for totals
                .text(`Subtotal: ${total}`)
                .text(`Total: ${total}`)
                .text('--------------------------------') // Separator

            // Footer
            printer
                .align('ct')
                .text('Thank you for shopping!')
                .text('Visit us again.')

            // Add a few empty lines for spacing (if required)
            printer.text('\n');

            // Print barcode
            printer
                .barcode(order.orderId.toUpperCase(), 'CODE39')
                .text('\n\n'); // Adding some more space after barcode if needed

            // Close the print job
            printer.close();
        });

        res.json({status: 'success', message: 'Print job sent'});
    } catch (e) {
        console.error(e);
        res.status(500).json({status: 'error', message: e.message});
    }
});


app.get('/drawer', async (req, res) => {
    try {
        const escpos = require('escpos')
        escpos.USB = require('escpos-usb')
        const device = new escpos.USB();
        const options = {encoding: "GB18030"}
        const printer = new escpos.Printer(device, options)

        await device.open(function () {
            printer
                .cashdraw(2)
                .close()
        });
        res.json(
            {status: 'success'}
        )
    } catch (e) {
        console.log(e)
        res.status(500).json({status: 'error', message: e.message});
    }
});
http.listen(port, () => {
    console.log(`PrinterServer: http://localhost:${port}`);
});