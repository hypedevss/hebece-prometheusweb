import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import PrometheusError from "../utils/errors/PrometheusError";
import { CookieJar } from "tough-cookie";
import { AddressBookEntryEn, AddressBookEntryRaw, MessageAttachmentEn, MessageBoxes, MessageDetailsEn, MessageDetailsRaw, MessageEn, MessageRaw, SelectedStudent, VParam } from ".";
import JSONFixer from "../utils/JSONFixer";
import { randomUUID } from "crypto";
import { USER_AGENT } from "../strings";

class MessageManager {
	initialize: () => Promise<boolean>;
	getMessages: (type: number, amount?: number, lastMessageId?: number) => Promise<Array<MessageEn>>;
	getMessageDetails: (apiGlobalKey: string) => Promise<MessageDetailsEn>;
	getAddressBook: (type: number) => Promise<any>;
	sendMessage: (receivers: Array<string>, subject: string, content: string) => void;
	constructor(jar: CookieJar, student: SelectedStudent) {
		const client = wrapper(axios.create({ jar }));
		let messageBoxId = null;
		let messageBoxName = null;
		let apiUrl = null;
		let VParam:VParam = null;
		this.initialize = async () => {
			const firstMessageReq = await client.get(student.messagesUrl);
			const $ = cheerio.load(firstMessageReq.data);
			const formUrl = $('form[name=hiddenform]').attr('action');
			const wa = $('input[name=wa]').val();
			const wresult = $('input[name=wresult]').val();
			const wctx = $('input[name=wctx]').val();
			const postForm = await client.post(formUrl, new URLSearchParams({
				'wa': wa.toString(),
				'wresult': wresult.toString(),
				'wctx': wctx.toString()
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			});
			const $$ = cheerio.load(postForm.data);
			if ($$('title').text() !== "Wiadomości") throw new PrometheusError('Unknown error.');
			const vparamHtml = $$('script').first().html();
			const regex = /var VParam = ({.*?});/s;
			const match = vparamHtml.match(regex);
			let vparam:VParam = null;
			if (match && match[1]) {
				vparam = await JSONFixer(match[1]);
			}
			apiUrl = vparam.apiUrl;
			const messageBoxInfoReq = await client.get(`${apiUrl}/Skrzynki`);
			const boxdata:Array<MessageBoxes> = messageBoxInfoReq.data;
			messageBoxId = boxdata[0].globalKey;
			messageBoxName = boxdata[0].nazwa;
			VParam = vparam;
			return true;
		}
		this.getMessages = async (type: number, amount?: number, lastMessageId?: number) => {
			if (!apiUrl) throw new PrometheusError('Please initialize the message manager first.');
			if (!amount) amount = 50;
			if (!lastMessageId) lastMessageId = 0;
			let typeName:string = null;
			switch (type) {
				case 0:
					typeName = "Odebrane"
					break;
				case 1:
					typeName = "Wyslane"
					break;
				case 2:
					typeName = "Usuniete"
					break;
				default:
					throw new PrometheusError('Unknown message type.');
			}
			const messagesReq = await client.get(`${apiUrl}/${typeName}?idLastWiadomosc=${lastMessageId}&pageSize=${amount}`, {
				headers: {
					"User-Agent": USER_AGENT
				}
			});
			const rawMessages:Array<MessageRaw> = messagesReq.data;
			const messages:Array<MessageEn> = [];
			for (let i = 0; i < rawMessages.length; i++) {
				const rawMessage = rawMessages[i];
				const message:MessageEn = {
					apiGlobalKey: rawMessage.apiGlobalKey,
					sender: rawMessage.korespondenci,
					subject: rawMessage.temat,
					date: rawMessage.data,
					box: messageBoxName,
					hasAttachments: rawMessage.hasZalaczniki,
					read: rawMessage.przeczytana,
					readBy: rawMessage.nieprzeczytanePrzeczytanePrzez,
					important: rawMessage.wazna,
					userRole: rawMessage.uzytkownikRola,
					deleted: rawMessage.wycofana,
					replied: rawMessage.odpowiedziana,
					forwarded: rawMessage.przekazana,
					id: rawMessage.id
				}
				messages.push(message);
			}
			return messages as Array<MessageEn>;
		}
		this.getMessageDetails = async(apiGlobalKey: string) => {
			const messageDetailsReq = await client.get(`${apiUrl}/WiadomoscSzczegoly?apiGlobalKey=${apiGlobalKey}`, {
				headers: {
					"User-Agent": USER_AGENT
				}
			});
			const messageDetails:MessageDetailsRaw = messageDetailsReq.data;
			let message:MessageDetailsEn = null;
			const messageAttachments:Array<MessageAttachmentEn> = [];
			if (!messageDetails) throw new PrometheusError('Unknown message.');
			for (let i = 0; i < messageDetails.zalaczniki.length; i++) {
				const attachment = messageDetails.zalaczniki[i];
				messageAttachments.push({
					url: attachment.url,
					name: attachment.nazwaPliku
				});
			}
			message = {
				data: messageDetails.data,
				apiGlobalKey: messageDetails.apiGlobalKey,
				sender: messageDetails.nadawca,
				senderType: messageDetails.nadawcaTyp,
				recipients: messageDetails.odbiorcy,
				content: messageDetails.tresc,
				read: messageDetails.odczytana,
				attachments: messageAttachments,
				senderInfo: messageDetails.nadawcaInfo,
				deleted: messageDetails.wycofana,
				deletedDate: messageDetails.dataWycofania,
				id: messageDetails.id
			}
			return message as MessageDetailsEn;

		}
		this.getAddressBook = async (type: number) => {
			if (!apiUrl) throw new PrometheusError('Please initialize the message manager first.');
			let typeName = null;
			switch (type) {
				case 0:
					typeName = "Pracownicy"
					break;
				case 1:
					typeName = "Uczniowie"
					break;
				case 2:
					typeName = "Opiekunowie"
					break;
				default:
					throw new PrometheusError('Unknown address book type.');
			}
			const addressBookReq = await client.get(`${apiUrl}/${typeName}?globalKeySkrzynka=${messageBoxId}`, {
				headers: {
					"User-Agent": USER_AGENT
				}
			});
			const addressBook:Array<AddressBookEntryRaw> = addressBookReq.data;
			const addressbookEn = [];
			for (let i = 0; i < addressBook.length; i++) {
				const entry = addressBook[i];
				let metadata = null;
				switch (type) {
					case 0:
						metadata = {
							roles: entry.metadata.role,
							otherLessonsIds: entry.metadata.dziennikiZajeciaInneIds,
							subjectsIds: entry.metadata.przedmiotyIds,
							departmentsIds: entry.metadata.oddzialyIds,
							preschoolDepartmentIds: entry.metadata.oddzialyPrzedszkolneIds,
							pupilDepartmentIds: entry.metadata.oddzialyIds,
							teacherDepartmentIds: entry.metadata.oddzialyWychowawcyIds,
							preschoolTeacherDepartmentIds: entry.metadata.oddzialyPrzedszkolneWychowawcyIds,
						}
						break;
					case 1:
						metadata = {
							isSchoolSelfGovernment: entry.metadata.isSamorzadSzkolny,
							otherLessonsIds: entry.metadata.dziennikiZajeciaInneIds,
							groupsIds: entry.metadata.grupyIds,
							departmentsIds: entry.metadata.oddzialyIds,
							studentSelfGovernmentDepartmentIds: entry.metadata.oddzialySamorzadUczniowskichIds,
							preschoolDepartmentIds: entry.metadata.oddzialyPrzedszkolneIds,
							pupilDepartmentIds: entry.metadata.oddzialyWychowankowieIds,
						}
						break;
					case 2:
						metadata = {
							otherLessonsIds: entry.metadata.dziennikiZajeciaInneIds,
							departmentsIds: entry.metadata.oddzialyIds,
							parentCouncilDepartmentIds: entry.metadata.oddzialyRadaRodzicowIds,
							preschoolDepartmentIds: entry.metadata.oddzialyPrzedszkolneIds,
							preschoolParentCouncilDepartmentIds: entry.metadata.oddzialyPrzedszkolneRadaRodzicowIds,
							pupilDepartmentIds: entry.metadata.oddzialyWychowankowieIds
						}
						break;
					default:
						throw new PrometheusError('Unknown address book type.');
				}
				addressbookEn.push({
					metadata: metadata,
					boxGlobalKey: entry.skrzynkaGlobalKey,
					name: entry.nazwa,
					department: entry.oddzial,
					nick: entry.pseudonim,
					hasInternetAccess: entry.hasInternetAccess
				});
			}
			return addressbookEn as Array<AddressBookEntryEn>;
		}
		this.sendMessage = async(receivers: Array<string>, subject: string, content: string) => {
			// validate receivers
			const employees:Array<AddressBookEntryEn> = await this.getAddressBook(0);
			const students:Array<AddressBookEntryEn> = await this.getAddressBook(1);
			const parents:Array<AddressBookEntryEn> = await this.getAddressBook(2);
			for (let i = 0; i < receivers.length; i++) {
				const findInEmployees = employees.find((entry) => entry.boxGlobalKey === receivers[i]);
				const findInStudents = students.find((entry) => entry.boxGlobalKey === receivers[i]);
				const findInParents = parents.find((entry) => entry.boxGlobalKey === receivers[i]);
				if (!findInEmployees && !findInStudents && !findInParents) {
					throw new PrometheusError('Unknown receiver.');
				}
			}
			const threadUuid = randomUUID();			
			const messageReq = await client.post(`${apiUrl}/WiadomoscNowa`, 
				{
					globalKey: threadUuid,
					watekGlobalKey: threadUuid,
					nadawcaSkrzynkaGlobalKey: messageBoxId,
					adresaciSkrzynkiGlobalKeys: receivers,
					tytul: subject,
					tresc: content,
					zalaczniki: [],
					powitalna: false
				}, 
				{
					headers: {
						Accept: 'application/json, text/plain, */*',
						'Accept-Encoding': 'gzip, deflate, br, zstd',
						"Content-Type": "application/json",
						"Sec-Fetch-Dest": "empty",
						"Sec-Fetch-Mode": "cors",
						"Sec-Fetch-Site": "same-origin",
						"User-Agent": USER_AGENT,
						"X-V-AppGuid": VParam.appGuid,
						"X-V-RequestVerificationToken": VParam.antiForgeryToken
					},
					validateStatus: () => true
				}
			)
			if (messageReq.status == 204) {
				return true;
			} else {
				throw new PrometheusError(`Failed to send message: ${messageReq.status}`);
			}
		}
	}
}

export default MessageManager;