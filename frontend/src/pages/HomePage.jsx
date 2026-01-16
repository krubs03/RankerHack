import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, } from '@clerk/clerk-react'
import toast from 'react-hot-toast'


const HomePage = () => {
    return (
        <div>
            <button className="btn btn-primary" onClick={() => toast.success("Success!!")}>Test Button</button>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="btn btn-primary">Sign In</button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <SignOutButton />
            </SignedIn>

            <UserButton />
        </div>
    )
}

export default HomePage
