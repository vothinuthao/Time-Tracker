﻿import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}