// require axios for petitios
const axios = require("axios");

const BotUrl =
  `https://api.telegram.org/bot${process.env.TOKEN_BOT}`;
const clientService = require("./clientService");

// create a new class for validate all messages
class botValidations {
  constructor() {}

  //validate message(client conversation)
  async validateMessage(message) {
    
    // If exists message
    if (message.message !== undefined) {
      console.log(message.message.text);
      // if message is a start conversation, show welcome message
      if (message.message.text == "/start") {
        await this.sendMessage(
          "¡Hola! 👋 Bienvenido al servicio automático para nuestros clientes TecnoSuper. ¿Qué deseas hacer hoy?",
          message.message.chat.id,
          true
        );

      // if client conversation is Register, can he enter a id 
      } else if (message.message.text === "Registrarse") {
        await this.sendMessage(
          "Ingrese su numero de identificacion sin puntos, comas y/o espacios",
          message.message.chat.id,
          false
        );
      
      // if option is consult, then use client service 
      } else if (message.message.text === "Consultar saldo") {
        const updateSaldo = new clientService();
        const responseUpdate = await updateSaldo.checkBalance(
          message.message.chat.id
        );

        if (responseUpdate.status === "noDeuda") {
          await this.sendMessage(
            "Usted no tiene saldos pendientes con TecnoSuper",
            message.message.chat.id,
            true
          );
        } else if (responseUpdate.status === "Deuda") {
          const saldoFormatted = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          });
          await this.sendMessage(
            `Usted tiene un saldo pendiente: \n${saldoFormatted.format(
              responseUpdate.Saldo
            )}`,
            message.message.chat.id,
            true
          );
        } else {
          await this.sendMessage(
            "Este telegram no se encuentra asociado, registrese primero y realice nuevamente la consulta",
            message.message.chat.id,
            true
          );
        }

      // if client enter a number or identifier
      } else if (this.validateNumer(message.message.text) === true) {
        await this.sendMessage("Validando...", message.message.chat.id, false);

        const updateClient = new clientService();
        const responseUpdate = await updateClient.validateClient(
          message.message.text,
          message.message.chat.id
        );

        if (responseUpdate.status === true) {
          await this.sendMessage(
            `Señor/a ${responseUpdate.client[0].Nombre} ${responseUpdate.client[0].Primer_Apellido} su telegram ha sido asociado con exito!!! \n A traves de este, podrá recibir notificaciones`,
            message.message.chat.id,
            false
          );
        } else {
          await this.sendMessage(
            "Parece que algo ha salido mal, intente ingresar nuevamente el documento de identificacion",
            message.message.chat.id
          );
        }
      
        
      // if command bot is not available, return welcome message
      } else {
        await this.sendMessage(
          "¡Hola! 👋 Bienvenido al servicio automático para nuestros clientes TecnoSuper. ¿Qué deseas hacer hoy?",
          message.message.chat.id,
          true
        );
      }
    }
  }

  // this function sends a message to chat_id client 
  async sendMessage(text, chat_id, markup) {
    try {
      var messageSend = "";
      if (markup === true) {
        messageSend = {
          chat_id: chat_id,
          text: text,
          reply_markup: {
            keyboard: [[{ text: "Registrarse" }, { text: "Consultar saldo" }]],
            resize_keyboard: true,
          },
        };
      } else {
        messageSend = {
          chat_id: chat_id,
          text: text,
        };
      }
      await axios.post(`${BotUrl}/sendMessage`, messageSend);
    } catch (error) {
      console.error(error);
    }
  }

  // this function validates if the message is a numeric message
  validateNumer(text) {
    return /^\d+$/.test(text.trim());
  }
}

module.exports = botValidations;
