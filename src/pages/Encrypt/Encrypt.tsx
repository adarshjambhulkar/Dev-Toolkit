import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SecretKeyInput } from '@/components/shared/SecretKeyInput';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';
import { encryptAES } from '@/utils/aes';
import { useAppDispatch, useAppSelector } from '@/store';
import { setEncryptState } from '@/store/slices/toolsSlice';

interface EncryptPageProps {
  secretKey: string;
  onSecretKeyChange: (key: string) => void;
}

export default function EncryptPage({ secretKey, onSecretKeyChange }: EncryptPageProps) {
  const dispatch = useAppDispatch();
  const encryptState = useAppSelector((state) => state.tools.encrypt);
  const { plainText, encryptedText } = encryptState;
  const [isLoading, setIsLoading] = useState(false);

  const updateState = (updates: Partial<typeof encryptState>) => dispatch(setEncryptState(updates));

  async function handleEncrypt() {
    if (!secretKey.trim()) {
      toast.warning('Please enter a secret key.');
      return;
    }
    if (!plainText.trim()) {
      toast.warning('Please enter text to encrypt.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await encryptAES(plainText, secretKey);
      updateState({ encryptedText: result });
      toast.success('Encrypted successfully!');
    } catch (err) {
      toast.error(
        'Encryption failed. Ensure the secret key is exactly 16, 24, or 32 bytes.',
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Input panel */}
      <div className="space-y-4">
        <SecretKeyInput
          value={secretKey}
          onChange={onSecretKeyChange}
          label="Secret Key"
        />
        <SectionCard
          title="Plain Text"
        >
          <Textarea
            value={plainText}
            onChange={(e) => updateState({ plainText: e.target.value })}
            placeholder="Enter text to encrypt..."
            className="font-mono text-sm h-[200px] sm:h-[260px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
          />
        </SectionCard>
        <Button onClick={() => void handleEncrypt()} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Encrypting...
            </>
          ) : (
            'Encrypt'
          )}
        </Button>
      </div>

      {/* Output panel */}
      <div className="space-y-4">
        <SectionCard
          title="Encrypted Output (Base64)"
          actions={
            encryptedText ? (
              <CopyButton getText={() => encryptedText} label="Copy" />
            ) : undefined
          }
        >
          <Textarea
            readOnly
            value={encryptedText}
            placeholder="Encrypted output will appear here..."
            className="font-mono text-sm h-[200px] sm:h-[260px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent px-3 sm:px-4 py-3"
          />
        </SectionCard>

        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Key requirements</p>
          <p>Secret key must be exactly <strong>16</strong>, <strong>24</strong>, or <strong>32</strong> characters (AES-128/192/256).</p>
          <p>The IV is randomly generated and prepended to the output.</p>
        </div>
      </div>
    </div>
  );
}
