/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "plugins/_misc/styles.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { Forms, UserStore, React } from "@webpack/common";
import { showToast, Toasts } from "@webpack/common";

const platformLabels = {
    desktop: "Desktop",
    web: "Web",
    mobile: "Mobile",
    embedded: "Console"
};

const settings = definePluginSettings({
    platform: {
        type: OptionType.SELECT,
        description: "What platform to show up as on",
        restartNeeded: true,
        options: [
            {
                label: "Desktop",
                value: "desktop",
                default: true,
            },
            {
                label: "Web",
                value: "web",
            },
            {
                label: "Mobile",
                value: "mobile",
            },
            {
                label: "Console",
                value: "embedded",
            },
        ],
        onChange: (newValue: string) => {
            const platformName = platformLabels[newValue] || newValue;
            showToast(`Connected to ${platformName}`, Toasts.Type.SUCCESS, {
                duration: 3000
            });
        }
    }
});

const ProfilePreview = () => {
    const currentPlatform = settings.store.platform ?? "desktop";
    const platformName = platformLabels[currentPlatform];

    // Get current user info
    const currentUser = UserStore.getCurrentUser();
    const avatarUrl = currentUser
        ? `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png?size=128`
        : null;

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
            backgroundColor: "var(--background-secondary)",
            borderRadius: "8px",
            marginTop: "16px"
        }}>
            <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#8d8d8d",
                marginBottom: "8px"
            }}>
                Current Platform Preview
            </div>

            <div style={{
                position: "relative",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid var(--brand-experiment)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}>
                {/* User Avatar as Mirror */}
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    <div style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "48px",
                        color: "white"
                    }}>
                        ?
                    </div>
                )}
            </div>

            <div style={{
                textAlign: "center",
                color: "#8d8d8d"
            }}>
                <div style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#8d8d8d"
                }}>
                    {platformName}
                </div>
                <div style={{
                    fontSize: "12px",
                    color: "#8d8d8d"
                }}>
                    Active Platform
                </div>
            </div>

            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "#1d1d1d",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#8d8d8d"
            }}>
                <span style={{ fontSize: "16px" }}>✓</span>
                Connected to {platformName}
            </div>
        </div>
    );
};

export default definePlugin({
    name: "PlatformSpoofer",
    description: "Spoof what platform or device you're on",
    authors: [Devs.pluckerpilple, Devs.V],
    settingsAboutComponent: () => (
        <>
            <Forms.FormText className="plugin-warning">
                Mujhid is not responsible for u violation of the laws :3
            </Forms.FormText>
            <ProfilePreview />
        </>
    ),
    settings: settings,
    patches: [
        {
            find: "_doIdentify(){",
            replacement: {
                match: /(\[IDENTIFY\].*let.{0,5}=\{.*properties:)(.*),presence/,
                replace: "$1{...$2,...$self.getPlatform()},presence"
            }
        }
    ],
    getPlatform: () => {
        switch (settings.store.platform ?? "desktop") {
            case "desktop":
                return { browser: "Discord Client" };
            case "web":
                return { browser: "Chrome" };
            case "mobile":
                return { browser: "Discord iOS" };
            case "embedded":
                return { browser: "Discord Embedded" };
        }
    }
});