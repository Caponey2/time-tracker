import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUserSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Activity } from '@prisma/client';
import { revalidatePath } from 'next/cache';

type NewActivityProps = {
	activity?: Activity;
};

const NewActivity = ({ activity }: NewActivityProps) => {
	async function createActivity(data: FormData) {
		'use server';
		const user = await getUserSession();
		console.log('New Activity', user);
		const activity = await prisma.activity.create({
			data: {
				name: data.get('name') as string,
				startAt: new Date(),
				userId: user.id,
			},
		});
		revalidatePath('/track');
	}

	return (
		<div>
			<h2>What are you working on?</h2>
			<form action={createActivity} className='flex items-center space-x-4'>
				<Input name='text' defaultValue={activity?.name || ''} />
				<Button type='submit'>Start</Button>
			</form>
		</div>
	);
};

const DailyActivities = () => {};

export default async function TrackPage() {
	const user = await getUserSession();

	const currentActivity = await prisma.activity.findFirst({
		where: {
			userId: user.id,
			tenantId: user.tenant.id,
			endAt: null,
		},
	});
	return (
		<main className='mx-auto container py-4'>
			<NewActivity />
		</main>
	);
}
