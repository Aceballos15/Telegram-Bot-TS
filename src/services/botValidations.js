const axios = require("axios");
const BotUrl =
  "https://api.telegram.org/bot6374276669:AAGx3_lIroSsaNmfxFSlDrQnV1I6UfhxHN4";
const clientService = require("./clientService");
class botValidations {
  constructor() {}

  //validate message
  async validateMessage(message) {
    if (message.message !== undefined) {
      console.log(message.message.text);

      if (message.message.text == "/start") {
        await this.sendMessage(
          "¡Hola! 👋 Bienvenido al servicio automático para nuestros clientes TecnoSuper. ¿Qué deseas hacer hoy?",
          message.message.chat.id,
          true
        );
      } else if (message.message.text === "Registrarse") {
        await this.sendMessage(
          "Ingrese su numero de identificacion sin puntos, comas y/o espacios",
          message.message.chat.id,
          false
        );
      } else if (message.message.text === "Consultar saldo") {
        const updateSaldo = new clientService();
        const responseUpdate = await updateSaldo.checkBalance(
          message.message.chat.id
        );

        console.log(responseUpdate);

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
      } else {
        await this.sendMessage(
          "¡Hola! 👋 Bienvenido al servicio automático para nuestros clientes TecnoSuper. ¿Qué deseas hacer hoy?",
          message.message.chat.id,
          true
        );
      }
    }
  }

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

  validateNumer(text) {
    return /^\d+$/.test(text.trim());
  }
}

module.exports = botValidations;
