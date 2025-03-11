'use client'

import { useState } from 'react'
import { ProfileSettings } from './profile-settings'
import { NotificationSettings } from './notification-settings'
import { AccountSettings } from './account-settings'
import { SecuritySettings } from './security-settings'
import type { Profile } from '@/types'

interface SettingsTabsProps {
  profile: Profile
}

const tabs = [
  { id: 'profile', label: '프로필' },
  { id: 'notifications', label: '알림' },
  { id: 'account', label: '계정' },
  { id: 'security', label: '보안' },
]

export function SettingsTabs({ profile }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="space-y-6">
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                border-b-2 py-4 px-1 text-sm font-medium
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-10">
        {activeTab === 'profile' && <ProfileSettings profile={profile} />}
        {activeTab === 'notifications' && <NotificationSettings profile={profile} />}
        {activeTab === 'account' && <AccountSettings profile={profile} />}
        {activeTab === 'security' && <SecuritySettings profile={profile} />}
      </div>
    </div>
  )
} 