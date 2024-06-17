const axios = require("axios");

// initialize a new class for a new client service 
class clientService {
  constructor() {}

  // method to valide if client exists in zoho database
  async validateClient(clientDocument, chat_id) {
    const urlFindClient = `https://zoho.accsolutions.tech/API/v1/Clientes_Report?where=Documento=="${clientDocument}"`;

    const response = await axios.get(urlFindClient);

    if (response.data.data.length > 0) {
      return await this.updateClient(response.data.data, chat_id);
    }else{
        return {
            status: false
        }
    }
  }

  // Update idTelegram client from zoho database
  async updateClient(idClient, chat_id) {
    try {
      const updateClientUrl = `https://zoho.accsolutions.tech/API/v1/Clientes_Report/${idClient[0].ID}`;
      const new_data = {
        "idTelegram": chat_id,
      };

      const response = await axios.patch(updateClientUrl, new_data);

      if (response.data !== null ) {
        return {
            status: true, 
            client: idClient[0]
        };
      }else{
        return {
            status: false
        }; 
      }
    } catch (error) {
      console.error(error);
    }
  }

  // this method find the client billings and return balances
  async checkBalance(chat_id){
    const urlFindClient = `https://zoho.accsolutions.tech/API/v1/Clientes_Report?where=idTelegram=="${chat_id}"`;
    const response = await axios.get(urlFindClient)

    if(response.data.data.length > 0 ){

      const idClient = response.data.data[0].ID;   

      const urlFindBalance = `https://zoho.accsolutions.tech/API/v1/Remision_Report?where=Cliente==${idClient}&&Saldo>0`

      const findBalanceCustomer = await axios.get(urlFindBalance)

      if(findBalanceCustomer.data.status === 400 )
      {
        return {
          status: "noDeuda"
        }
      }else{
        return {
          "status": "Deuda", 
          "Saldo": this.sumarSaldo(findBalanceCustomer.data.data)
        }
      }


    }else{
      return {
        status: "noRegistrado"
      }
    }


  }

  // this method, show summary for "Saldo" column 
  sumarSaldo(array){

    var sumaTotal = array.reduce((acumulador, currencyObject) =>{

      return acumulador + parseFloat(currencyObject.Saldo)
    }, 0)

    return sumaTotal
  }; 

}


module.exports = clientService