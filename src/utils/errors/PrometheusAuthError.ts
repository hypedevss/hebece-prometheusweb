class PrometheusAuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PrometheusAuthError";
	}
}

export default PrometheusAuthError;