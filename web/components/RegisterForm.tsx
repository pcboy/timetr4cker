import * as React from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoreContext } from "../App";
import { routes } from "../config/routes";
import styled from "styled-components";

import { RootStore } from "../App";

import { BasicContainer } from "../layouts/ApplicationLayout";

const SRegisterForm = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  padding-top: 7.5rem;
  text-align: center;
  font-weight: 700;
`;

const RegisterBox = styled.div`
  position: relative;
  margin-top: 10rem;
  form {
    height: 4rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  input {
    width: 100%;
    max-width: 35rem;
    padding-right: 10rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  button {
    margin-left: -10rem;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .errors {
    margin-top: 1rem;
    color: white;
  }
`;

export const RegisterForm = observer(() => {
  const {
    handleSubmit,
    register,
    setError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  const { dirty, isSubmitting, touched, submitCount } = formState;

  const store = useContext<RootStore>(StoreContext);
  const {
    router: { goTo },
  } = store;

  const onSubmit = (values, e) => {
    axios
      .post(
        process.env.API_URL + "/users",
        { email: values.email },
        { withCredentials: true }
      )
      .then(
        (response) => {
          e.target.reset();

          console.log(response);
          goTo(routes.dashboard);
        },
        (error) => {
          console.log(error);
          setError([
            {
              type: "ALREADY_EXISTS",
              name: "email",
              message: (
                <p>User already exists. Do you want to Log In instead?</p>
              ),
            },
          ]);
        }
      );
  };

  return (
    <SRegisterForm>
      <BasicContainer>
        <>
          <h1>Prevent your plants from dying.</h1>
          <h1>Manage your crops with a simple open source dashboard.</h1>

          <RegisterBox>
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="email"
                name="email"
                placeholder="Your email"
                autoComplete="nope"
                ref={register({
                  required: "Email required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "invalid email address",
                  },
                })}
              ></input>

              <button
                type="submit"
                style={{ height: "100%" }}
                className={`button ${isSubmitting && "is-loading"}`}
                disabled={isSubmitting}
              >
                Register
              </button>
            </form>
            {errors.email && errors.email.message && (
              <div className="errors">{errors.email.message}</div>
            )}
          </RegisterBox>
        </>
      </BasicContainer>
    </SRegisterForm>
  );
});
