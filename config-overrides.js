module.exports = {
	webpack: config => {
		return {
			...config,
			externals: {
				config: 'quizConfig',
			}
		}
	}
}