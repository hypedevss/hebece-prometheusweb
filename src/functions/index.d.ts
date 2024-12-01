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

interface VParamUser {
	name: string
}
export interface VParam {
	appName: string,
	moduleName: string
	antiForgeryToken: string
	appGuid: string
	appUrl: string
	appCustomerDb: string
	apiUrl: string
	wiadomosciUrl: string
	wiadomosciNazwa: string
	logoutUrl: string
	prometeuszUrl: string
	user: VParamUser
	appVersion: string
	downloaderUrl: string
	downloaderBuffer: string
	downloaderInterval: string
	helpUrl: string
	manualUrl: string
	lastUpdatesUrl: string
	isStudent: boolean
	isParent: boolean
}

interface ContextData {
	idDziennik: number
	rodzajDziennika: number
	dziennikDataOd: string
	dziennikDataDo: string
	isUczen: boolean
	isPrzedszkolak: boolean
	isWychowanek: boolean
	key: string
	uczen: string
	oddzial: string
	jednostka: string
	jednostkaGodzinaOd: null | string
	jednostkaGodzinaDo: null | string
	isDorosli: boolean
	isPolicealna: boolean
	is13: boolean
	isArtystyczna: boolean
	isArtystyczna13: boolean
	isSpecjalna: boolean
	pelnoletniUczen: boolean
	opiekunUcznia: boolean
	wymagaAutoryzacji: boolean
	posiadaPesel: boolean
	aktywny: boolean
	globalKeySkrzynka: string
	config: ContextConfig
}

interface ContextConfig {
	isOplaty: boolean
	isPlatnosci: boolean
	isZaplac: boolean
	isScalanieKont: boolean
	isJadlospis: boolean
	isOffice365: boolean
	isSynchronizacjaEsb: boolean
	isDydaktyka: boolean
	isNadzorPedagogiczny: boolean
	isZmianaZajecia: boolean
	isZglaszanieNieobecnosci: boolean
	isLekcjeZrealizowane: boolean
	isLekcjeZaplanowane: boolean
	isPodreczniki: boolean
	oneDriveClientId: string
	projectClient: null
	payByNetUrlForPayment: string
}

export interface Context {
	uczniowie: Array<ContextData>
}

export interface SelectedStudent {
	context: Context
	apiUrl: string
	messagesUrl: string
	name: string
	key: string
	messageBoxId: string
}