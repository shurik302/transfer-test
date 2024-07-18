const nodemailer = require("nodemailer");
require('dotenv').config();

class TicketService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD
			}
		});
	}

	validateEmail(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	}

	async sendTicketMail(to, ticketData, qrCodeImage) {
		if (!to) {
			console.error("Адреса електронної пошти отримувача не вказана");
			throw new Error('Адреса електронної пошти отримувача не вказана');
		}

		if (!this.validateEmail(to)) {
			console.error(`Некоректний формат адреси електронної пошти отримувача: ${to}`);
			throw new Error('Некоректний формат адреси електронної пошти отримувача');
		}

		const formatDate = (date, time) => {
			const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'Europe/Kiev' };
			const formattedDate = new Date(date).toLocaleDateString('uk-UA', options);
			return `${formattedDate} о ${time}`;
		};

		try {
			await this.transporter.sendMail({
				from: process.env.SMTP_USER,
				to: to,
				subject: 'Ваш квиток',
				text: `Доброго дня, ${ticketData.firstName} ${ticketData.lastName}, Вас вітає наш сайт. Ми раді повідомити, що Ваш квиток було придбано успішно!`,
				html: `
          <div style="font-family: 'Open Sans', sans-serif; padding: 20px; width: calc(90% - 40px); margin: 20px 5%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; flex-direction: column; gap: 5px;">
              <h1 style="font-size: 30px; font-weight: 500;">Доброго дня, ${ticketData.firstName} ${ticketData.lastName}, Вас вітає Bustravel!</h1>
              <span style="font-size: 20px; font-weight: 400;">Ми раді повідомити, що Ваш квиток було придбано успішно!</span>
              <span style="font-size: 20px; font-weight: 400;">Деталі поїздки:</span>
            </div>

            <div style="display: flex; flex-direction: row; width: 100%; margin-top: 20px;">
              <div style="border: 1px solid black; display: flex; flex-direction: column; gap: 20px; width: 50%; padding: 10px;">
                <div style="border-bottom: 1px solid black; padding-bottom: 10px;">
                  <span style="font-size: 30px; font-weight: 600;">Маршрут</span>
                </div>
                <div style="padding-top: 10px;">
                  <span style="font-size: 20px; font-weight: 400;">Звідки: ${ticketData.from}</span><br/>
                  <span style="font-size: 20px; font-weight: 400;">Куди: ${ticketData.to}</span>
                </div>
              </div>
              <div style="border: 1px solid black; display: flex; flex-direction: column; gap: 20px; width: 50%; padding: 10px;">
                <div style="border-bottom: 1px solid black; padding-bottom: 10px;">
                  <span style="font-size: 30px; font-weight: 600;">Додаткова інформація</span>
                </div>
                <div style="padding-top: 10px;">
                  <span style="font-size: 20px; font-weight: 400;">Дата та час відправлення: ${formatDate(ticketData.date_departure, ticketData.departure)}</span><br/>
                  <span style="font-size: 20px; font-weight: 400;">Дата та час прибуття: ${formatDate(ticketData.date_arrival, ticketData.arrival)}</span><br/>
                  <span style="font-size: 20px; font-weight: 400;">Ціна квитка: ${ticketData.price}</span><br/>
                  <span style="font-size: 20px; font-weight: 400;">Кількість пасажирів: ${ticketData.passengers}</span>
                </div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <span style="font-size: 20px; font-weight: 400;">QR-код:</span><br/>
              <img src="${qrCodeImage}" alt="QR Code" style="margin-top: 10px;"/>
            </div>
          </div>`
			});

			console.log(`Лист з квитком відправлено на ${to}`);
		} catch (error) {
			console.error(`Помилка при відправленні листа з квитком: ${error.message}`);
			throw new Error('Помилка при відправленні листа з квитком');
		}
	}
}

module.exports = new TicketService();
