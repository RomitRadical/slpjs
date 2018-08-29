var slputils = require('./slputils')

class SlpTokenType1 {
    static get lokadIdHex() { return "534c5000" }

    static buildGenesisOpReturn(ticker, name, documentUrl, documentHash, decimals, batonVout, initialQuantity) {
        let script = []

        // OP Return Prefix
        script.push(0x6a)

        // Lokad Id
        let lokadId = Buffer.from(this.lokadIdHex, 'hex')
        script.push(slputils.getPushDataOpcode(lokadId))
        lokadId.forEach((item) => script.push(item))

        // Token Type
        let tokenType = 0x01
        script.push(slputils.getPushDataOpcode([tokenType]))
        script.push(tokenType)

        // Transaction Type
        let transactionType = Buffer.from('GENESIS')
        script.push(slputils.getPushDataOpcode(transactionType))
        transactionType.forEach((item) => script.push(item))

        // Ticker
        if (ticker == null || ticker.length === 0) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            ticker = Buffer.from(ticker)
            script.push(slputils.getPushDataOpcode(ticker))
            ticker.forEach((item) => script.push(item))
        }

        // Name
        if (name == null || name.length === 0) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            name = Buffer.from(name)
            script.push(slputils.getPushDataOpcode(name))
            name.forEach((item) => script.push(item))
        }

        // Document URL
        if (documentUrl == null || documentUrl.length === 0) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            documentUrl = Buffer.from(documentUrl)
            script.push(slputils.getPushDataOpcode(documentUrl))
            documentUrl.forEach((item) => script.push(item))
        }

        // Document Hash
        if (documentHash == null || documentHash.length === 0) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            documentHash = Buffer.from(documentHash)
            script.push(slputils.getPushDataOpcode(documentHash))
            documentHash.forEach((item) => script.push(item))
        }

        // Decimals
        if (decimals < 0 || decimals > 9) {
            throw Error("Decimals property must be in range 0 to 9")
        } else {
            script.push(slputils.getPushDataOpcode([decimals]))
            script.push(decimals)
        }

        // Baton Vout
        if (batonVout == null) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            if (batonVout <= 1) {
                throw Error("Baton vout must be 2 or greater")
            }
            script.push(slputils.getPushDataOpcode([batonVout]))
            script.push(batonVout)
        }

        // Initial Quantity
        initialQuantity = slputils.int2FixedBuffer(initialQuantity * 10**decimals, 8)
        script.push(slputils.getPushDataOpcode(initialQuantity))
        initialQuantity.forEach((item) => script.push(item))

        let encodedScript = slputils.encodeScript(script)
        if (encodedScript.length > 223) {
            throw Error("Script too long, must be less than 223 bytes.")
        }
        return encodedScript
    }

    static buildSendOpReturn(tokenIdHex, decimals, outputQtyArray) {
        let script = []

        // OP Return Prefix
        script.push(0x6a)

        // Lokad Id
        let lokadId = Buffer.from(this.lokadIdHex, 'hex')
        script.push(slputils.getPushDataOpcode(lokadId))
        lokadId.forEach((item) => script.push(item))

        // Token Type
        let tokenType = 0x01
        script.push(slputils.getPushDataOpcode([tokenType]))
        script.push(tokenType)

        // Transaction Type
        let transactionType = Buffer.from('SEND')
        script.push(slputils.getPushDataOpcode(transactionType))
        transactionType.forEach((item) => script.push(item))

        // Token Id
        let tokenId = Buffer.from(tokenIdHex, 'hex')
        script.push(slputils.getPushDataOpcode(tokenId))
        tokenId.forEach((item) => script.push(item))

        // Output Quantities
        if (outputQtyArray.length > 19) {
            throw Error("Cannot have more than 19 SLP token outputs.")
        }
        if (outputQtyArray.length < 1) {
            throw Error("Cannot have less than 1 SLP token output.")
        }
        outputQtyArray.forEach((outputQty) => {
            if (outputQty < 0) {
                throw Error("All outputs must be 0 or greater")
            }
            let qtyBuffer = slputils.int2FixedBuffer(outputQty * 10**decimals, 8)
            script.push(slputils.getPushDataOpcode(qtyBuffer))
            qtyBuffer.forEach((item) => script.push(item))
        })

        let encodedScript = slputils.encodeScript(script)
        if (encodedScript.length > 223) {
            throw Error("Script too long, must be less than 223 bytes.")
        }
        return encodedScript
    }
}

module.exports = SlpTokenType1