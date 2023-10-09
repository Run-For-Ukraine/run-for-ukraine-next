import React, { useState } from "react";
import { wave } from "@/lib/axiosInstances";
import {
  StackedBoxAmountSelector,
  StackedTextAmountSelector,
} from "./DonateWidgetAmountSelector";

export interface WidgetDonateFormProps {
  campaign: string;
  onTabCreated: (tab: any) => void;
  useBoxSelector?: boolean;
  donateType?: string;
}

function WidgetDonateForm(props: WidgetDonateFormProps) {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullname] = useState("");
  const [memo, setMemo] = useState("");
  const [addNote, setAddNote] = useState(false);

  const isRegister = () => {
    return props.donateType === "register";
  };
  const [addIdentity, setAddIdentity] = useState(isRegister);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputData = {
      campaign_slug: props.campaign,
      amount: parseInt((Number(amount) * 100).toString()),
      email,
      name: fullName,
      comment: memo,
      referrer: window.location.href,
    };
    // https://stackoverflow.com/a/39387533
    var windowReference = window.open("", "", "width=1024, height=768");
    wave.post("/tab", inputData).then((result) => {
      props.onTabCreated(result.data);
      if (!!result.data.url && windowReference) {
        windowReference.location = result.data.url;
      }
    });
  };

  const handleAddIdentity = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setAddIdentity(true);
  };

  const handleAddNote = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setAddNote(true);
  };

  return (
    <div className="2fua-donate-form">
      <p className="text-base uppercase font-semibold">
        SELECT AMOUNT TO DONATE
      </p>
      {props.useBoxSelector ? (
        <StackedBoxAmountSelector
          onSelect={(amount: number) => setAmount(amount.toString())}
        />
      ) : (
        <StackedTextAmountSelector
          onSelect={(amount: number) => setAmount(amount.toString())}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className="sfua-donate-form__input-box">
          <span className="sfua-donate-form__input-box__prefix">CAD</span>
          <input
            type="number"
            name="amount"
            value={amount}
            className="sfua-donate-form__input-box__large"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        {!addIdentity || !addNote ? (
          <div className="sfua-donate-form__add">
            {!addIdentity ? (
              <a href="#" onClick={handleAddIdentity}>
                Include email to receive updates
              </a>
            ) : null}
            {/*{addIdentity === addNote ? " | " : null}*/}
            {/*{!addNote ? (*/}
            {/*  <a href="#" onClick={handleAddNote}>*/}
            {/*    Add a note*/}
            {/*  </a>*/}
            {/*) : null}*/}
          </div>
        ) : null}

        <div className="sfua-donate-form__input-box">
          <input
            type="text"
            name="email"
            value={email}
            placeholder="Email (optional)"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {addIdentity ? (
          <div className="sfua-donate-form__input-box">
            <input
              type="text"
              name="fullName"
              value={fullName}
              placeholder="Full name (optional)"
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
        ) : null}
        {addNote ? (
          <div className="sfua-donate-form__input-box">
            <textarea
              name="memo"
              value={memo}
              placeholder="Note (optional)"
              rows={7}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        ) : null}
        <div>
          <div className="invoice-insights__payments-banner">
            <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--bank-payment"></div>
            <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-amex"></div>
            <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-mastercard"></div>
            <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-visa"></div>
          </div>
          <div className="sfua-donate-form__submit-alt ">
            <input
              className=""
              type="submit"
              value={props.donateType === "register" ? "Register" : "Donate"}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default WidgetDonateForm;