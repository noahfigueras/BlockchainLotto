const {expect} = require("chai");

describe("Lottery Contract", function() {

    //Defining global variables for testing.
    const alarm_oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
    const oraclePayment = 0.1;
    const price_lottery = 1;
    const alarm_jobId = "982105d690504c5d9ce374d040c08654";
    const governance_contract_addr = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
    let owner;
    let Lottery;
    let lottery;

    beforeEach(async function () {
        Lottery = await ethers.getContractFactory("Lottery");
        [owner] = await ethers.getSigners();

        lottery = await Lottery.deploy(
            alarm_oracle,
            oraclePayment,
            price_lottery,
            alarm_jobId,
            governance_contract_addr
        );
    });

    it("is supposed to start a new lottery", async function() {


        //Testing ground...
    })
})
