export interface LoginSuccessObject {
	success: boolean
	html: string
}

export interface ApiApContent {
	Success: boolean,
	Tokens: Array<string>,
	Alias: string,
	Email: string,
	EmailCandidate: null,
	GivenName: string,
	Surname: string,
	IsConsentAccepted: boolean,
	CanAcceptConsent: boolean,
	AccessToken: string,
	ErrorMessage: null,
	Capabilities: Array<string>,
}

export interface ApJwt {
	name: string
	uid: string
	tenant: string
	unituid: string
	uri: string
	service: string
	caps: string
	nbf: number
	exp: number
	iat: number
}

export interface PrometheusStudent {
	name: string
	journalUrl: string
	symbol: string
}