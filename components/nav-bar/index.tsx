import Link from 'next/link';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getUserSession } from '@/lib/auth';

const links = [{ href: '/track', label: 'Track' }];
export async function NavBar() {
	const user = await getUserSession();
	console.log('Session', user);
	return (
		<div className=' shadow'>
			<div className='flex mx-auto container items-center py-2'>
				<Link href='/' className='px-2 py-1 hover:bg-slate-100 rounded'>
					<span className='font-semibold'>Time Tracker</span>
				</Link>
				<nav>
					<ul>
						{links.map(({ href, label }) => (
							<li key={href}>
								<Link
									href={href}
									className='px-2 py-1 hover:bg-slate-100 rounded text-blue-500 hover:text-blue-600'>
									{' '}
									{label}{' '}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<span className='flex-grow' />
				<Avatar>
					<AvatarImage src={user.image} referrerPolicy='no-referrer' />
				</Avatar>
			</div>
		</div>
	);
}
