import { useEffect } from 'react';
import Button from '../components/ui/Button';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Page,
  Hero,
  HeroBg,
  HeroInner,
  HeroCopy,
  Title,
  Lead,
  Main,
  Shell,
  OfferGrid,
  OfferCard,
  OfferTitle,
  OfferText,
  FeatureList,
  FeatureItem,
  FeatureIcon,
  FeatureCopy,
  FeatureTitle,
  FeatureText,
  CheckoutCard,
  CheckoutLabel,
  CheckoutTitle,
  Price,
  PriceNote,
  CheckoutActions,
  SecureNote,
} from './BluePassport.styles';

export default function BluePassport() {
  const { t } = useTranslation();
  const p = t.bluePassport;

  useEffect(() => {
    document.title = p.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.meta.description);
  }, [p.meta.title, p.meta.description]);

  return (
    <PageTransition>
      <Page>
        <Hero>
          <HeroBg aria-hidden="true" />
          <HeroInner>
            <HeroCopy>
              <Title>{p.hero.title}</Title>
              <Lead>{p.hero.lead}</Lead>
            </HeroCopy>
          </HeroInner>
        </Hero>

        <Main>
          <Shell>
            <OfferGrid>
              <OfferCard>
                <OfferTitle>{p.offer.title}</OfferTitle>
                <OfferText>{p.offer.text}</OfferText>
                <FeatureList>
                  {p.features.map((feature) => (
                    <FeatureItem key={feature.title}>
                      <FeatureIcon aria-hidden="true">{feature.icon}</FeatureIcon>
                      <FeatureCopy>
                        <FeatureTitle>{feature.title}</FeatureTitle>
                        <FeatureText>{feature.text}</FeatureText>
                      </FeatureCopy>
                    </FeatureItem>
                  ))}
                </FeatureList>
              </OfferCard>

              <CheckoutCard>
                <CheckoutLabel>{p.checkout.label}</CheckoutLabel>
                <CheckoutTitle>{p.checkout.title}</CheckoutTitle>
                <Price>{p.checkout.price}</Price>
                <PriceNote>{p.checkout.priceNote}</PriceNote>
                <CheckoutActions>
                  <Button to="/blue-passport/become-a-member" variant="primary" size="lg">
                    {p.checkout.applyCta}
                  </Button>
                  <Button to="/contact" variant="outline" size="lg">
                    {p.checkout.questionsCta}
                  </Button>
                </CheckoutActions>
                <SecureNote>{p.checkout.secureNote}</SecureNote>
              </CheckoutCard>
            </OfferGrid>
          </Shell>
        </Main>
      </Page>
    </PageTransition>
  );
}
