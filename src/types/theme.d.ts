type FontStyle = 'normal' | 'italic' | 'oblique';
type Image = {
  uid: string;
  url: string;
  size: number;
  type: string;
  name: string;
  is_active: boolean;
};
type Theme = {
  uuid?: string;
  slug?: string;
  theme_name: string;
  primary_color: string;
  window_border_color: string;
  default_font: Font;
  default_font_size_offset: number;
  default_font_color: string;
  body_bg_style: string;
  body_bg_color: string;
  body_bg_image?: Image;
  body_margin: number;
  body_bg_image_library: Image[];
  page_title_selected_item_color: string;
  page_title_background_color: string;
  page_title_text_color: string;
  page_title_font: Font;
  page_title_font_variant: string;
  page_title_font_size: number;
  logo_full?: Image;
  logo_full_library: Image[];
  logo_square?: Image;
  logo_square_library: Image[];
  icon_library: Image[];
  locale: string;
  direction: DIR_LTR | DIR_RTL;
  sidebar_nav: {
    display_style: string;
    include_logo: string;
    background_style: string;
    background_color: string;
    background_image?: Image;
    background_image_library?: Image[];
    include_profile_menu: boolean;
    btn_style_type: 'btn-style-rounded' | 'btn-style-rectangle';
    btn_edge_color: string;
    btn_bg_color: string;
    btn_selected_bg_color: string;
    btn_hover_bg_color: string;
    btn_text_color: string;
    btn_selected_text_color: string;
    btn_hover_text_color: string;
    font: Font;
    font_variant: FontStyle;
    font_size: number;
    icon_size_offset: number;
    btn_height: number;
    btn_spacing: number;
    space_above_navigation: number;
  };
  header: {
    display_style: string;
    include_logo: string;
    background_style: string;
    include_profile_menu: boolean;
    background_color: string;
    background_image?: Image;
    background_image_library?: Image[];
    btn_bg_color: string;
    btn_selected_bg_color: string;
    btn_hover_bg_color: string;
    btn_text_color: string;
    btn_selected_text_color: string;
    btn_hover_text_color: string;
  };
  // top_nav: {
  //   display_style: string;
  //   background_style: string;
  //   background_color: string;
  //   background_image?: Image;
  //   background_image_library?: Image[];
  //   btn_bg_color: string;
  //   btn_selected_bg_color: string;
  //   btn_hover_bg_color: string;
  //   btn_text_color: string;
  //   btn_selected_text_color: string;
  //   btn_hover_text_color: string;
  // };
  side_tray: {
    font: Font;
    size: number;
    color: string;
    bg_style: string;
    bg_color: string;
    bg_color_1: string;
    bg_color_2: string;
  };
  widget: {
    bg_color: string;
    border_color: string;
    border_radius: number;
    border_width: number;
    outline_color: string;
    element_outline_color: string;
    element_outline_width: number;
    outline_width: number;
    shadow_box: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string;
    };
    spacing: {
      x: number;
      y: number;
    };
    font_setting: {
      font: Font;
      variant: FontStyle;
      size_offset: number;
      color: string;
    };
    title: {
      font: Font;
      variant: FontStyle;
      size_offset: number;
    };
    table: {
      primary_color: string;
      secondary_color: string;
      rollover_color: string;
      style: string;
      row_spacing: number;
      radius: number;
    };
    list: {
      bg_color: string;
      rollover_color: string;
      style: string;
      radius: number;
      spacing: number;
    };
    form: {
      bg_color: string;
      border_color: string;
      border_size: number;
      border_radius: number;
    };
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};
