import { prisma } from '@/lib/prisma';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import { session } from '@/lib/auth';

const authOption: NextAuthOptions = {
	session: {
		strategy: 'jwt',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			console.log({ account, profile });
			if (!profile?.email) {
				throw new Error('No Profile');
			}
			const user = await prisma.user.upsert({
				where: {
					email: profile.email,
				},
				create: {
					email: profile.email,
					name: profile.name,
					avatar: (profile as any).picture,
					tenant: {
						create: {},
					},
				},
				update: {
					name: profile.name,
					avatar: (profile as any).picture,
				},
			});
			console.log('user', user);
			return true;
		},
		session,
		async jwt({ token, account, profile, user }) {
			// Persist the OAuth access_token and or the user id to the token right after signin
			console.log({ token, account, profile, user });
			if (profile) {
				const user = await prisma.user.findUnique({
					where: {
						email: profile.email,
					},
				});
				if (!user) {
					throw new Error('No User Found');
				}
				token.id = user.id;
				token.tenant = {
					id: user.tenantId,
				};
			}
			return token;
		},
	},
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
