import SettingsClient from "./SettingsClient";
import { getSettings, getModerators } from "@/lib/services/settings.service";

export const metadata = { title: "Settings — RW'26 Admin" };

export default async function AdminSettingsPage() {
    const settings = await getSettings();
    const moderators = await getModerators();

    return <SettingsClient initialSettings={settings} initialModerators={moderators} />;
}
