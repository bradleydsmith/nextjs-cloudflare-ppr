'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClientComponent() {
    const [counter, setCounter] = useState(0);

    const increaseCounter = () => {
        setCounter(counter + 1);
    }

    return (
        <div className="text-center">
            <div>
                This page just demonstrates a client component working and navigation
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    { counter }
                </div>
                <Button onClick={increaseCounter}>+ Increase</Button>
            </div>
            <div className="mt-4">
                <Link href="/">
                    <Button>Go to home</Button>
                </Link>
            </div>
        </div>
    )
}