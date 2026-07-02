import type { Schema, Struct } from '@strapi/strapi';

export interface AdmissionInquiryAdmissionDocument
  extends Struct.ComponentSchema {
  collectionName: 'admission_documents';
  info: {
    description: 'Document required for admission';
    displayName: 'Admission Document';
  };
  attributes: {
    placeholderUrl: Schema.Attribute.String;
    status: Schema.Attribute.Enumeration<['pending', 'uploaded', 'verified']> &
      Schema.Attribute.DefaultTo<'pending'>;
    type: Schema.Attribute.Enumeration<
      [
        'birth_certificate',
        'national_id',
        'transcript',
        'photo',
        'recommendation_letter',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface AdmissionInquiryGuardianInfo extends Struct.ComponentSchema {
  collectionName: 'guardian_infos';
  info: {
    description: "Information about the applicant's guardian";
    displayName: 'Guardian Info';
  };
  attributes: {
    email: Schema.Attribute.Email;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
    relationship: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdmissionInquiryInterviewInfo extends Struct.ComponentSchema {
  collectionName: 'interview_infos';
  info: {
    description: 'Interview scheduling and outcome';
    displayName: 'Interview Info';
  };
  attributes: {
    interviewer: Schema.Attribute.String;
    location: Schema.Attribute.String;
    outcome: Schema.Attribute.Enumeration<['pending', 'pass', 'fail']> &
      Schema.Attribute.DefaultTo<'pending'>;
    scheduledAt: Schema.Attribute.DateTime;
  };
}

export interface BlocksCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_blocks_call_to_actions';
  info: {
    description: '';
    displayName: 'CallToAction';
    icon: 'bullhorn';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false>;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faqs';
  info: {
    description: '';
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'image';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    buttons: Schema.Attribute.Component<'shared.button', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksImageGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_galleries';
  info: {
    description: '';
    displayName: 'ImageGallery';
    icon: 'picture';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
  };
}

export interface BlocksTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_blocks_testimonials';
  info: {
    description: '';
    displayName: 'Testimonial';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface BlocksTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_blocks';
  info: {
    description: '';
    displayName: 'TextBlock';
    icon: 'layer';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: '';
    displayName: 'button';
    icon: 'cursor';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'admission-inquiry.admission-document': AdmissionInquiryAdmissionDocument;
      'admission-inquiry.guardian-info': AdmissionInquiryGuardianInfo;
      'admission-inquiry.interview-info': AdmissionInquiryInterviewInfo;
      'blocks.call-to-action': BlocksCallToAction;
      'blocks.faq': BlocksFaq;
      'blocks.hero': BlocksHero;
      'blocks.image-gallery': BlocksImageGallery;
      'blocks.testimonial': BlocksTestimonial;
      'blocks.text-block': BlocksTextBlock;
      'shared.button': SharedButton;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
