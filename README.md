## Query builder for GraphQL

If you want to create a GraphQL query/mutation without creating from string.

### Usage

```js
import { query, mutation } from "@ss-graphql/ss-graphql";
import { field, grouping, transform } from "@ss-graphql/ss-graphql/helpers";
import { graphql, buildSchema } from "graphql";

const helloQuery = query();
const withArgumentsQuery = query();
const returningFieldsQuery = query();
const createUserMutation = mutation();

/**
 * For hello query
 */
helloQuery.call("hello" /* GraphQL method name */);
// Result query: query { hello }

/**
 * For withArguments query
 */
withArgumentsQuery.call(
  "withArguments" /* GraphQL method name */,
  grouping( /* Simple array values grouping */
    field( /* Add `id` param to `withArguments` method */
      "id" /* Param name */,
      327851235 /* Param value (value can only be string or number) */
    )
  )
);
// Result query: query { withArguments(id: 327851235) }

/**
 * For returningFields query
 */
returningFieldsQuery.call(
  "returningFields"
  grouping(
    field(
      "id",
      327851235
    ),
    field(
      "name",
      "John Doe"
    )
  )
).get([ /* Call `.get()` to return fields */
  "someField", /* Returning field name */
  "someOtherField",
  "lastField",
]);
// Result query: query { returningFields(id: 327851235) { someField, someOtherField, lastField } }

/**
 * For createUser mutation
 * Works exactly the same to queries
 */
createUserMutation.call(
  "createUser",
  field("user", grouping(
    field("firstName", "Jane"),
    field("lastName", "Doe"),
    field("email", "test@mail.com"),
    field("phoneNumber", grouping( /* Here we are adding subfields */
      field("country", 1),
      field("value", "1234567890")
    ))
  ))
).get([
  "id",
  "email",
  ["phoneNumber", ["country"]], /* Get subfield `country` from `phoneNumber` */
]);
// Result mutation: mutation { createUser(user: { firstName: "Jane", lastName: "Doe", email: "test@mail.com", phoneNumber: { country: 1, value: "1234567890" }) { id, email, phoneNumber { country } } }

const schema = buildSchema(`
  type Query {
    hello: String
    withArguments(id: ID): String
    returningFields(id: ID, name: String): MyFields
  }

  type Mutation {
    createUser(user: UserInput): UserOutput
  }

  input UserInput {
    id: ID,
    firstName: String
    lastName: String
    email: String
    phoneNumber: PhoneNumber
  }

  type PhoneNumber {
    country: Int,
    value: String
  }

  type UserOutput {
    id: ID,
    firstName: String
    lastName: String
    email: String
    phoneNumber: PhoneNumber
  }

  type MyFields {
    someField: String
    someOtherField: Int
    lastField: Boolean
  }
`);

const root = {
  /* Create query functions */
  hello() {
    return "Hella world";
  },
  withArguments(args) {
    const id = args.id;
    return `Given ID was ${id}`;
  },
  returningFields(args) {
    const id = args.id;
    const name = args.name;

    return {
      someField: "Hola",
      someOtherField: 213,
      lastField: false,
    };
  },

  /* Create mutation functions */
  createUser(args) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber
    } = args.user;

    /* Add logic to save user in database */
    finalUser = {
      id: "1234567890",
      firstName,
      lastName,
      email,
      phoneNumber
    }

    return finalUser;
  }
};

(async () => {
  const helloResult = await graphql(schema, transform(helloQuery), root);
  const argumentsResult = await graphql(schema, transform(withArgumentsQuery), root);
  const fieldsResult = await graphql(schema, transform(returningFieldsQuery), root);

  const createdUser = await graphql(schema, transform(createUserMutation), root);
})();
```

### Issues? That's good I can improve :)
Go ahead and post it, I will fix it as soon as possible
