import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";
import * as jwt from 'jose';
import { ApiApContent, ApJwt, PrometheusStudent } from ".";
import PrometheusError from "../utils/errors/PrometheusError";
export default async function listStudents(jar: CookieJar, html: string) {
	const client = wrapper(axios.create({ jar }));
	const ap = await client.get('https://eduvulcan.pl/api/ap');
	const $ap = cheerio.load(ap.data);
	const $ = cheerio.load(html);
	const apRaw = $ap('input[id=ap]').val();
	const apJson:ApiApContent = JSON.parse(apRaw.toString())
	const apStudents:Array<ApJwt> = [];
	for (let i = 0; i < apJson.Tokens.length; i++) {
		const token = apJson.Tokens[i];
		const decoded:ApJwt = jwt.decodeJwt(token);
		apStudents.push(decoded);
	}
	const prometheusStudents: Array<PrometheusStudent> = [];
	$('.connected-account-name').each((i, element) => {
		const link = $(element).closest('a');
		const journalLink = link.attr('href');
		const studentName = $(element).text().replace('                                            ', '').replace('\n', '').replace('\r', '').split('\n')[0];
		const pairApWithPrometheus = apStudents.find(student => student.name === studentName);
		if (pairApWithPrometheus) {
			prometheusStudents.push({
				name: studentName,
				journalUrl: journalLink,
				symbol: pairApWithPrometheus.tenant
			})
		} else {
			throw new PrometheusError("Failed to find student's tenant.")
		}
	})
	return prometheusStudents;

}