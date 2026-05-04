import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "accent";
}

export function Card({ children, className = "", variant = "default" }: CardProps) {
    const variantClass = variant === "accent" ? "rw-card-accent" : "rw-card";
    
    return (
        <div className={`${variantClass} ${className}`}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
    return (
        <div className={`px-5 py-4 border-b border-[var(--rw-border)] ${className}`}>
            {children}
        </div>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
    return (
        <div className={`p-5 ${className}`}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
    return (
        <div className={`px-5 py-4 border-t border-[var(--rw-border)] bg-rw-bg-alt/50 ${className}`}>
            {children}
        </div>
    );
}
