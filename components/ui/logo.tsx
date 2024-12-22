import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
    showText: boolean
}

const Logo = ({ showText }: LogoProps) => {
    return (
        <Link href='/' className='flex items-center gap-x-4'>
            <Image
                src="/logo.png"
                height={48}
                width={48}
                alt="logo"
            />
            {showText && (
                <p className="hidden sm:block font-semibold text-xl ">
                    DeliveryHub
                </p>
            )}
        </Link>
    )
}

export default Logo