// Extends Express types globally
declare namespace Express {
	export interface Request {
		userInfo?: { userId: string; username: string; role: string };
	}
}
