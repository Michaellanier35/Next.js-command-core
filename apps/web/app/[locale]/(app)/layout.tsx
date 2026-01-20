import { config } from "@repo/config";
import { Document } from "@shared/components/Document";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { PropsWithChildren } from "react";

const locales = Object.keys(config.i18n.locales);

export function generateStaticParams() {
\treturn locales.map((locale) => ({ locale }));
}

export default async function AppLocaleLayout({
	children,
	params,
}: PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
	const { locale } = await params;

	setRequestLocale(locale);

	if (!locales.includes(locale)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<Document locale={locale}>
			<NextIntlClientProvider locale={locale} messages={messages}>
				{children}
			</NextIntlClientProvider>
		</Document>
	);
}
