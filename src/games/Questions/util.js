const DIVIDER = 3

export const isPointsQuestion = question =>
	(question + 1) % DIVIDER === 0
