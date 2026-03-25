import { useState } from 'react';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SecretKeyInput } from '@/components/shared/SecretKeyInput';
import { JsonTreeViewer } from '@/components/shared/JsonTreeViewer';
import { CopyButton } from '@/components/shared/CopyButton';
import { SectionCard } from '@/components/shared/SectionCard';
import { decryptAES } from '@/utils/aes';

interface DecryptPageProps {
  secretKey: string;
  onSecretKeyChange: (key: string) => void;
}

export function DecryptPage({ secretKey, onSecretKeyChange }: DecryptPageProps) {
  const [cipherText, setCipherText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDecrypt() {
    if (!secretKey.trim()) {
      toast.warning('Please enter a secret key.');
      return;
    }
    if (!cipherText.trim()) {
      toast.warning('Please enter cipher text to decrypt.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await decryptAES(cipherText, secretKey);
      setDecryptedText(result);
      try {
        const parsed = JSON.parse(result) as unknown;
        setParsedJson(parsed);
      } catch {
        setParsedJson(null);
      }
      toast.success('Decrypted successfully!');
    } catch (err) {
      toast.error('Decryption failed. Check your key and cipher text.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input panel */}
        <div className="space-y-4">
          <SecretKeyInput
            value={secretKey}
            onChange={onSecretKeyChange}
            label="Secret Key"
          />
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Cipher Text (Base64)</Label>
            <Textarea
              value={cipherText}
              onChange={(e) => setCipherText(e.target.value)}
              placeholder="Paste Base64-encoded cipher text here..."
              className="font-mono text-sm min-h-[100px] sm:min-h-[180px] resize-y"
            />
          </div>
          <Button onClick={() => void handleDecrypt()} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Decrypting...
              </>
            ) : (
              'Decrypt'
            )}
          </Button>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          <SectionCard
            title="Decrypted Text"
            actions={
              decryptedText ? (
                <CopyButton getText={() => decryptedText} label="Copy" />
              ) : undefined
            }
          >
            <Textarea
              readOnly
              value={decryptedText}
              placeholder="Decrypted output will appear here..."
              className="font-mono text-sm min-h-[100px] sm:min-h-[180px] resize-y border-0 rounded-none focus-visible:ring-0 bg-transparent"
            />
          </SectionCard>
        </div>
      </div>

      {/* JSON Preview */}
      {parsedJson !== null && (
        <SectionCard
          title="JSON Preview"
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="h-7 gap-1 text-xs"
              >
                {isCollapsed ? (
                  <>
                    <ChevronRight className="h-3.5 w-3.5" />
                    Expand
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    Collapse
                  </>
                )}
              </Button>
              <CopyButton getText={() => JSON.stringify(parsedJson, null, 2)} label="Copy JSON" />
            </>
          }
        >
          <div className="overflow-auto max-h-96">
            <JsonTreeViewer data={parsedJson} collapsed={isCollapsed} />
          </div>
        </SectionCard>
      )}
    </div>
  );
}
