import { useEffect } from "react";
import { json } from "@remix-run/node";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  List,
  Link,
  InlineStack,
  EmptyState,
  DataTable,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { useLoaderData } from "@remix-run/react";
import { formatDistanceToNow, parseISO } from "date-fns";

export const loader = async ({ request }) => {
  const auth = await authenticate.admin(request);
  const shop = auth.session.shop;
  console.log("shop: -------> ", shop);
  // get data from database for that shop acending by id
  const wishlistData = await db.wishlist.findMany({
    where: {
      shop: shop,
    },
    orderBy: {
      id: "asc",
    },
  });

  console.log("wishlistData: -------> ", wishlistData);

  return json(wishlistData);
};

export const action = async ({ request }) => {};

export default function Index() {
  const wishlistData = useLoaderData();
  const wishlistArray = wishlistData.map((item) => {
    const createdAt = formatDistanceToNow(parseISO(item.createdAt), {
      addSuffix: true,
    });
    return [item.customerId, item.productId, createdAt];
  });

  return (
    <Page title="Wishlist overview dashboard">
      <ui-title-bar title="Overview"></ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              {wishlistData.length > 0 ? (
                <DataTable
                  columnContentTypes={["text", "text", "text"]}
                  headings={["Customer ID", "Product ID", "Created At"]}
                  rows={wishlistArray}
                />
              ) : (
                <EmptyState
                  heading="Manage your wishlist products here." /* action={{
                    content: "Learn more",
                    url: "https://youtube.com",
                    external: "true",
                  }}
                  secondaryAction={{
                    content: "Watch videos",
                    url: "https://youtube.com",
                    external: "true",
                  }} */
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <Text as="h2" variant="headingMd">
                    You don't have any products in your wishlist yet.
                  </Text>
                  <p>
                    Currently store owner are able to see the ID of product and
                    customer here . if The customer click wishlist button appear
                    below the product.{" "}
                  </p>
                </EmptyState>
              )}
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Installation Guide
                  </Text>
                  <BlockStack gap="200">
                    <Text as="p" variant="bodyMd">
                      Follow these steps to install the We-C-List app in your
                      Shopify store:
                    </Text>
                    <BlockStack gap="100">
                      <List>
                        <List.Item>
                          <Text as="p" variant="bodyMd">
                            Search for "<strong>we-c-list</strong>" in the
                            Shopify App Store.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text as="p" variant="bodyMd">
                            Click on "Install" to add the app to your store.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text as="p" variant="bodyMd">
                            Open the customization settings of your store.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text as="p" variant="bodyMd">
                            Navigate to the product page and find the block
                            inside the template from the left custom settings of
                            your app.
                          </Text>
                        </List.Item>
                      </List>
                    </BlockStack>
                  </BlockStack>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Beta Version
                  </Text>
                  <List>
                    <List.Item>
                      This app is currently in beta version.{" "}
                      {/* <Link
                        url="https://youtube.com"
                        target="_blank"
                        removeUnderline
                      >
                        {" "}
                        Wishlist app
                      </Link>{" "} */}
                    </List.Item>
                    <List.Item>
                      After the succesfful implementation of this app. we gonna
                      launch more new plugin{" "}
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
