import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Label from "components/Form/Label";
import ToolTipInput from "components/Form/TooltipFields/Input";
import TabStyled from "components/TabStyled";
import InnerPageLayout from "layouts/inner-app-layout";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";

const RDivider = styled(Divider)(({ theme }) => ({
  margin: "30px 0",

  [`${theme.breakpoints.down("sm")}`]: {
    margin: "20px 0",
  },
}));

const LabelHolder = styled(Grid)(({ theme }) => ({
  ".MuiFormLabel-root": {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "400",
    color: theme.palette.text.primary,
  },

  [`${theme.breakpoints.down("sm")}`]: {
    marginBottom: "20px",
  },
}));

const StackHolder = styled(Stack)(({ theme }) => ({
  // maxWidth: "400px",
  padding: "0 0 0 10px",

  ".MuiFormLabel-root ": {
    fontSize: "14px",
    lineHeight: "20px",
    color: theme.palette.text.primary,
    margin: "0 0 8px",
  },
}));

type VectorKnowledgebaseSettingsFormProps = {
  vectorKnowledgebase?: VectorKnowledgebase;
};

const vkFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

type VKFormType = z.infer<typeof vkFormSchema>;

const VectorKnowledgebaseSettingsForm: React.FC<VectorKnowledgebaseSettingsFormProps> =
  (props) => {
    const { vectorKnowledgebase } = props;

    const { mutate: updateVectorKnowledgebase } = useUpdateItem({
      modelName: ApiModels.VectorKnowledgebase,
    });

    const form = useForm<VKFormType>({
      mode: "onBlur",
      defaultValues: {
        name: "",
        description: "",
      },
      resolver: zodResolver(vkFormSchema),
    });

    const { handleSubmit } = form;

    useEffect(() => {
      if (vectorKnowledgebase) {
        form.reset(vectorKnowledgebase);
      }
    }, [vectorKnowledgebase]);

    const onSubmit = (value: VKFormType) => {
      if (vectorKnowledgebase) {
        updateVectorKnowledgebase({
          slug: vectorKnowledgebase.slug,
          data: value,
        });
      }
    };

    return (
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <RDivider />
            <Grid container>
              <LabelHolder item xs={12} sm={5}>
                <Label label="General" />
              </LabelHolder>
              <Grid item sm={7} xs={12}>
                <StackHolder spacing={2.5}>
                  <ToolTipInput
                    name="name"
                    label="Vector Knowledgebase Title"
                  />
                  <ToolTipInput
                    tooltipInlineElementProps={{
                      rows: 2,
                      multiline: true,
                      variant: "filled",
                    }}
                    name="description"
                    label="Vector Knowledgebase Description"
                  />
                </StackHolder>
              </Grid>
            </Grid>
            <RDivider />
          </Box>
        </form>
      </FormProvider>
    );
  };

type VectorKnowledgebaseSettingsProps = {};

const VectorKnowledgebaseSettings: React.FC<VectorKnowledgebaseSettingsProps> =
  (props) => {
    const { slug } = useParams<{ slug: string }>();

    const { data: vectorKnowledgebase } = useGetItem({
      modelName: ApiModels.VectorKnowledgebase,
      slug: slug,
    });

    const theme = useTheme();
    const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));
    const [searchParams] = useSearchParams();

    const [value, setValue] = useState(Number(searchParams.get("t")) || 0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const tabLists = useMemo(() => {
      const tabs = [
        {
          label: <TabStyled title="Settings" />,
        },
      ];
      return tabs;
    }, [xlScreen]);

    return (
      <InnerPageLayout
        title={vectorKnowledgebase?.name}
        onChange={handleChange}
        subtitle={
          <Typography variant="body1" color="text.secondary">
            Description:{" "}
            <Typography
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              <>{vectorKnowledgebase?.description}</>
            </Typography>
          </Typography>
        }
        tabList={tabLists}
        value={value}
      >
        {value === 0 && (
          <VectorKnowledgebaseSettingsForm
            vectorKnowledgebase={vectorKnowledgebase}
          />
        )}
      </InnerPageLayout>
    );
  };

export default VectorKnowledgebaseSettings;
