"use client";

import { useState } from "react";
import { User, UserUpdate } from "@/types/user";
import { usePersonalities, useCharacters } from "@/hooks/useMasterOptions";
import ProfileTagSelector from "./ProfileTagSelector";

const MAX_PERSONALITIES = 5;
const MAX_CHARACTERS = 5;

type Props = {
  user: User;
  onSubmit: (input: UserUpdate) => Promise<void>;
};

export default function ProfileEditForm({ user, onSubmit }: Props) {
  const [name, setName]           = useState(user.name);
  const [email, setEmail]         = useState(user.email);
  const [birthDate, setBirthDate] = useState(user.birth_date ?? "");
  const [bio, setBio]             = useState(user.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url ?? "");
  const [occupation, setOccupation] = useState(user.occupation ?? "");
  const [studyContent, setStudyContent] = useState(user.study_content ?? "");
  const [dream, setDream] = useState(user.dream ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);
  const [permissionLevel, setPermissionLevel] = useState(user.permission_level);
  const [personalityIds, setPersonalityIds] = useState(
    user.personalities.map((p) => p.id)
  );
  const [characterIds, setCharacterIds] = useState(
    user.characters.map((c) => c.id)
  );

  const { items: personalityOptions, loading: personalitiesLoading } = usePersonalities();
  const { items: characterOptions, loading: charactersLoading } = useCharacters();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await onSubmit({
        name,
        email,
        birth_date: birthDate || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
        permission_level: permissionLevel,
        occupation: occupation || null,
        study_content: studyContent || null,
        dream: dream || null,
        personality_ids: personalityIds,
        character_ids: characterIds,
      });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-6">プロフィール編集</h2>

      {/* 成功メッセージ */}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">
          プロフィールを更新しました
        </p>
      )}

      {/* エラーメッセージ */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
          {error}
        </p>
      )}

      {/* プロフィール画像プレビュー */}
      {avatarUrl && (
        <div className="flex justify-center mb-6">
          <img
            src={avatarUrl}
            alt="プロフィール画像"
            className="w-24 h-24 rounded-full object-cover border border-gray-200"
          />
        </div>
      )}

      <div className="space-y-4">
        {/* 名前 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 職業 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            職業
          </label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="例：会社員、学生、フリーランス"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 学習内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            学習内容
          </label>
          <input
            type="text"
            value={studyContent}
            onChange={(e) => setStudyContent(e.target.value)}
            placeholder="例：Typescript, Python"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 生年月日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            生年月日
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 自己紹介 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            自己紹介
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="自己紹介を入力してください"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* 将来の夢 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            将来の夢
          </label>
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            rows={3}
            placeholder="将来の夢を入力してください"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* プロフィール画像URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            プロフィール画像URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            画像のURLを入力するとプレビューが表示されます
          </p>
        </div>
        {/* 権限レベル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            権限レベル
          </label>
          <select
            value={permissionLevel}
            onChange={(e) => setPermissionLevel(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>一般ユーザー</option>
            <option value={2}>管理者</option>
          </select>
        </div>
        {/* 性格・特徴 */}
        <div className="space-y-4">
          <ProfileTagSelector
            label="性格"
            options={personalityOptions}
            selectedIds={personalityIds}
            onChange={setPersonalityIds}
            max={MAX_PERSONALITIES}
            color="blue"
            loading={personalitiesLoading}
          />
          <ProfileTagSelector
            label="特徴"
            options={characterOptions}
            selectedIds={characterIds}
            onChange={setCharacterIds}
            max={MAX_CHARACTERS}
            color="green"
            loading={charactersLoading}
          />
        </div>
      </div>


      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        {submitting ? "更新中..." : "プロフィールを更新する"}
      </button>
    </form>
  );
}