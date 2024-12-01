class PrometheusError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PrometheusError";
	}
}

export default PrometheusError;