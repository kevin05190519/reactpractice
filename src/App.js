import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './main.css'
import Web3 from 'web3'
import promisify from 'util.promisify'


class App extends Component {
  constructor (props) {
    super(props)

    // Init
    this.web3Provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/c21c8b750fe546fda43222e14b532a15')
    this.web3 = new Web3(this.web3Provider)

    var abi= [
	{
		"constant": true,
		"inputs": [
			{
				"name": "ck_address",
				"type": "address"
			}
		],
		"name": "check_detail",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "com_register",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"name": "uaddre",
				"type": "address"
			},
			{
				"name": "ID",
				"type": "string"
			},
			{
				"name": "ct",
				"type": "string"
			},
			{
				"name": "ct_state",
				"type": "bool"
			},
			{
				"name": "ureg_state",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "uaddress",
				"type": "address"
			},
			{
				"name": "uID",
				"type": "string"
			},
			{
				"name": "ct",
				"type": "string"
			}
		],
		"name": "user_register",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "uaddress",
				"type": "address"
			}
		],
		"name": "end_ct",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "companys",
		"outputs": [
			{
				"name": "caddre",
				"type": "address"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "creg_state",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "uaddress",
				"type": "address"
			},
			{
				"name": "ct",
				"type": "string"
			}
		],
		"name": "user_np",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "relationships",
		"outputs": [
			{
				"name": "caddre",
				"type": "address"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "creg_state",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
     this.contract = this.web3.eth.contract(abi).at("0x5453723a18f4f0e95fa5b3b9a6faa10f21cdd7e6");

    this.state = {
      loading: true,
      lucky: 'n/a',
      transaction: 'n/a',
      result:'n/a'
    }
    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  doAirDrop = async (addNum, subNum) => {
    const accounts = this.web3.eth.accounts
    const sendTransaction = promisify(this.web3.eth.sendTransaction)
    const to = accounts[addNum] //accounts[Math.floor(accounts.length * Math.random())]
    const address = await sendTransaction({
      from: accounts[subNum], //accounts[0],
      to,
      value: 10
    }).catch(console.error)

    this.setState({ lucky: to, transaction: address })

  }
  componentDidMount = async () => {
    const coinbase = this.web3.eth.coinbase
    const balance = this.web3.eth.getBalance(coinbase).toString()

    // Watch for change
    this.web3.eth.filter('latest').watch(() => {
      const balance = this.web3.eth.getBalance(coinbase).toString()
      this.setState({ balance })
    })

    // Send some ether every second
    //setInterval(this.doAirDrop, 1000)

    this.setState({ loading: false, coinbase, balance })
  }

  showAccount = lucky =>
    this.web3.eth.accounts.map((account, index) => (
      <tr>
        <td>{index}</td>
        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>
          {account}
        </td>
        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>       {this.web3.eth.getBalance(account).toString()}
        </td>
        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>       {this.contract.companys.call(account)[1]}
        </td>

        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>       {this.contract.check_detail.call(account)[0]}
        </td>
        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>       {this.contract.check_detail.call(account)[1]}
        </td>
        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>       {this.contract.check_detail.call(account)[2].toString()}
        </td>
        <td key={index} style={{ color: lucky === account ? 'red' : 'black' }}>       {this.contract.check_detail.call(account)[3]}
        </td>
      </tr>
    ))

  handleClick = () => {
    var addInput = this.refs.addAccount, subInput = this.refs.subAccount;
    this.doAirDrop(addInput.value, subInput.value)
  }



  cregClick = () => {

    var caccountinput = this.refs.caccount;
    var cnameinput = this.refs.cname;
    //Get some props
    this.contract.com_register.sendTransaction(cnameinput.value,{
            from:this.web3.eth.accounts[caccountinput.value],
            gas:3000000},function(error, hash){
                if(error){
                  this.setState({ result:"false"})
                }
                else{
                var receipt = this.web3.eth.getTransactionReceipt(hash);
                this.setState({ result:receipt.status,transaction:receipt['transactionHash']})
                }
            }.bind(this));

  }
  uregClick = () => {
    var comaccountinput = this.refs.comaccount;
    var uaccountinput = this.refs.uaccount;
    var uidinput = this.refs.uid;
    var ctinput = this.refs.ct;

    //Get some props
    this.contract.user_register.sendTransaction(this.web3.eth.accounts[uaccountinput.value],uidinput.value,ctinput.value,{
              from:this.web3.eth.accounts[comaccountinput.value],
              gas:3000000},function(error, hash){
                  if(error){
                    this.setState({ result:"false"})
                  }
                  else{
                    var receipt = this.web3.eth.getTransactionReceipt(hash);
                    this.setState({ result:receipt['status'],transaction:receipt['transactionHash']})
                  }
              }.bind(this));



}
  npClick = () => {

    var npaccountinput = this.refs.np_account;
    var npcompanyinput = this.refs.np_company;
    var newcontractinput = this.refs.new_contract;

    //Get some props
    this.contract.user_np.sendTransaction(this.web3.eth.accounts[npaccountinput.value],newcontractinput.value,{
              from:this.web3.eth.accounts[npcompanyinput.value],
              gas:3000000,
            value:1000000000000000000},function(error, hash){
                if(error){
                  this.setState({ result:"false"})
                }
                else{
                  var receipt = this.web3.eth.getTransactionReceipt(hash);
                  this.setState({ result:receipt['status'],transaction:receipt['transactionHash']})
                }
            }.bind(this));
}
  endcontractClickk= () => {

    var endaccountinput = this.refs.endaccount;

    //Get some props
    this.contract.check_detail.sendTransaction(this.web3.eth.accounts[endaccountinput.value],{
              from:this.web3.eth.accounts[endaccountinput.value],
              gas:3000000
            },function(error, hash){
                if(error){
                  this.setState({ result:"false"})
                }
                else{
                  var receipt = this.web3.eth.getTransactionReceipt(hash);
                  this.setState({ result:receipt['status'],transaction:receipt['transactionHash']})
                }
            }.bind(this));

}
  render () {
    // Loading
    if (this.state.loading) return <p>loading...</p>

    // Done
    return (
      <div className="page margin">
        <p>coinbase : {this.state.coinbase}</p>
        <p>balance : {this.state.balance}</p>

        <div className="table width">
          <table class="ui teal table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Account</th>
                <th>$</th>
                <th>c_name</th>
                <th>uID</th>
                <th>contract</th>
                <th>contact state</th>
                <th>company</th>
              </tr>
            </thead>
            <tbody>
              {this.showAccount(this.state.lucky)}
            </tbody>
          </table>
        </div>

        <div class="ui labeled input">
          <div class="ui label">
            Added ID
          </div>
          <input type="text" placeholder="$+" ref="addAccount" />
        </div>

        <div class="ui labeled input">
          <div class="ui label">
            Subed ID
          </div>
          <input type="text" placeholder="$-" ref="subAccount" />
        </div>

        <button class="ui button" onClick={this.handleClick}>
            Click me
        </button>

<p>
        <div>
          company register :
        </div>
        <div class="ui labeled input">
          <div class="ui label">
            comregister
          </div>
          <input type="text" placeholder="$+" ref="caccount" />
        </div>

        <div class="ui labeled input">
          <div class="ui label">
            name
          </div>
          <input type="text" placeholder="$+" ref="cname" />
        </div>

        <button class="ui button" onClick={this.cregClick}>
            Click me
        </button>
</p>
<p>
        <div>
            user register :
        </div>
        <div class="ui labeled input">
            <div class="ui label">
            company
            </div>
        <input type="text" placeholder="$+" ref="comaccount" />
        </div>

        <div class="ui labeled input">
            <div class="ui label">
            user_register
            </div>
          <input type="text" placeholder="$+" ref="uaccount" />
        </div>

        <div class="ui labeled input">
            <div class="ui label">
            userID
            </div>
        <input type="text" placeholder="$+" ref="uid" />
        </div>

        <div class="ui labeled input">
            <div class="ui label">
            contract
            </div>
          <input type="text" placeholder="$+" ref="ct" />
        </div>

        <button class="ui button" onClick={this.uregClick}>
            Click me
        </button>
</p>
<p>
        <div>
            user NP :
        </div>
        <div class="ui labeled input">
            <div class="ui label">
            np company
            </div>
        <input type="text" placeholder="$+" ref="np_company" />
        </div>

        <div class="ui labeled input">
            <div class="ui label">
            np account
            </div>
        <input type="text" placeholder="$+" ref="np_account" />
        </div>

        <div class="ui labeled input">
            <div class="ui label">
            new contract
            </div>
          <input type="text" placeholder="$+" ref="new_contract" />
        </div>

        <button class="ui button" onClick={this.npClick}>
            Click me
        </button>
</p>
<p>
        <div>
              end contract :
        </div>
        <div class="ui labeled input">
            <div class="ui label">
            end contract
            </div>
        <input type="text" placeholder="$+" ref="endaccount" />
        </div>

        <button class="ui button" onClick={this.endcontractClick}>
            Click me
        </button>
</p>
        <p>lucky : {this.state.lucky}</p>
        <p>transaction : {this.state.transaction}</p>
        <p>result : {this.state.result}</p>
      </div>
    )
  }
}

export default App
