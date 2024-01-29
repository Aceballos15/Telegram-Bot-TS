const axios = require("axios");

class clientService {
  constructor() {}

  async validateClient(clientDocument, chat_id) {
    const urlFindClient = `https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Clientes_Report?where=Documento%3D%3D%22${clientDocument}%22`;

    const response = await axios.get(urlFindClient);

    if (response.data.length > 0) {
      return await this.updateClient(response.data, chat_id);
    }else{
        return {
            status: false
        }
    }
  }

  async updateClient(idClient, chat_id) {
    try {
      const updateClientUrl = `https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Clientes_Report/${idClient[0].ID}`;
      const new_data = {
        "idTelegram": chat_id,
      };

      const response = await axios.patch(updateClientUrl, new_data);

      if (response.data !== null ) {
        return {
            status: true, 
            client: idClient
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


  async checkBalance(chat_id){
    const urlFindClient = `https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Clientes_Report?where=idTelegram%3D%3D%22${chat_id}%22`;
    const response = await axios.get(urlFindClient)

    if(response.data.length > 0 ){

      const idClient = response.data[0].ID;   

      const urlFindBalance = `https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Remision_Report?where=Cliente.ID%3D%3D${idClient}%26%26Saldo%3E0`

      const findBalanceCustomer = await axios.get(urlFindBalance)

      console.log(findBalanceCustomer.data)

      if(findBalanceCustomer.data.status === 400 )
      {
        return {
          status: "noDeuda"
        }
      }else{
        return {
          "status": "Deuda", 
          "Saldo": this.sumarSaldo(findBalanceCustomer.data)
        }
      }


    }else{
      return {
        status: "noRegistrado"
      }
    }


  }


  sumarSaldo(array){

    var sumaTotal = array.reduce((acumulador, currencyObject) =>{

      return acumulador + parseFloat(currencyObject.Saldo)
    }, 0)

    return sumaTotal
  }; 

}


module.exports = clientService