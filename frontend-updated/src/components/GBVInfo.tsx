import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const GBVInfo = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl mb-2">Understanding Gender-Based Violence</CardTitle>
                  <CardDescription className="text-base">
                    Gender-based violence (GBV) is any harmful act directed at an individual based on their gender. 
                    It includes physical, sexual, psychological, or economic harm and can occur in public or private spaces.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Examples of Gender-Based Violence:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">Physical Violence:</strong> Hitting, slapping, pushing, or any form of physical harm</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">Sexual Violence:</strong> Rape, sexual assault, harassment, or coercion</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">Emotional/Psychological Abuse:</strong> Threats, intimidation, isolation, or verbal abuse</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">Economic Abuse:</strong> Controlling access to money, preventing employment, or economic exploitation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">Harmful Traditional Practices:</strong> Forced marriage, female genital mutilation, or honor-based violence</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Other Reportable Incidents:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Workplace harassment or discrimination</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Stalking or cyberbullying</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Child abuse or exploitation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Human trafficking</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Domestic violence incidents</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <p className="text-sm text-foreground">
                  <strong>Remember:</strong> No form of violence is acceptable. If you or someone you know is experiencing any form of violence, 
                  please reach out for help. You can report anonymously, and our verified organizations are here to support you.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GBVInfo;
