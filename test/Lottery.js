const {expect} = require("chai");

describe("Lottery Contract", function() {

    beforeEach(async function () {
        const [owner] = await ethers.getSigners();
        const alarm_oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        const oraclePayment = 0.1;
        const price_lottery = 1;
        const alarm_jobId = "982105d690504c5d9ce374d040c08654";
        const governance_contract_addr = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
    });


    it("is supposed to start a new lottery", async function() {

        const Lottery = await ethers.getContractFactory("Lottery");

        const lottery = await Lottery.deploy(
            alarm_oracle,
            oraclePayment,
            price_lottery,
            alarm_jobId,
            governance_contract_addr
        );

        //Testing ground...
    })
})
