const Heading = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="flex flex-col items-center pb-6">
            <img
                src="/logo.png"
                width={50}
                height={50}
                alt="Logo"
                className="mx-auto"
            />
            <p className="text-xl font-medium">{title}</p>
            <p className="text-small text-default-500">{description}</p>
        </div>
    )
}

export default Heading