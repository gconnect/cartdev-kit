'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useEthersSigner } from '../../utils/useEtherSigner';
import { createOrUpdateRequest, getRequest } from '../../cartesi/services/RestApiCalls';
import { errorAlert, successAlert } from '../../utils/customAlert';
import {
  Table,
  Thead,
  Tbody, Tr,
  Th,
  Td,
  TableCaption,
  TableContainer
} from '@chakra-ui/react';


export default function Greetings() {
  const [loading, setLoading] = useState(false);
  const [listMessages, setMessageList] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [isEdit, setEdit] = useState(false);
  const [id, setId] = useState(0);

  const { address } = useAccount();
  const signer = useEthersSigner();

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);

  const sendGreeting = async () => {
    try {
      if (!message) return errorAlert("Field required");
      if (!address) return errorAlert("Ensure your wallet is connected");
      setLoading(true);
      await createOrUpdateRequest(signer, "greetings", "POST",
        JSON.stringify({ message, sender: address }));
      setMessage("");
      setLoading(false);
      successAlert("Successfully sent!");
      await getGreetings();
    } catch (error) {
      setLoading(false);
      console.log(error);
      errorAlert(error);
    }
  };

  const updateMessage = async (id: number) => {
    try {
      if (!message) return errorAlert("Field required");
      if (!address) return errorAlert("Ensure your wallet is connected");
      setLoading(true);
      await createOrUpdateRequest(signer, `greetings/${id}`, "PUT", JSON.stringify({ message, sender: address }));
      setMessage("");
      setLoading(false);
      successAlert("Successfully sent!");
      setEdit(false);
      await getGreetings();
    } catch (error) {
      setLoading(false);
      errorAlert(error);
    }
  };

  const getGreeting = useCallback(async (id: number) => {
    try {
      setFetching(true);
      await getRequest(`greetings/${id}`);
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.log("error", error);
    }
  }, []);

  const getGreetings = useCallback(async () => {
    try {
      setFetching(true);
      const res = await getRequest("greetings");
      console.log("res", res);
      console.log(JSON.parse(res!).greetings);
      setMessageList(JSON.parse(res!).greetings); // Assuming res is JSON string
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.log("error", error);
    }
  }, []);

  console.log("listMessages", listMessages);
  console.log("id", id);
  useEffect(() => {
    getGreetings();
  }, [getGreetings]);

  return (
    <div className="flex min-h-screen flex-col lg:mb-2 md:mb-8 mb-36 items-center text-black">
      <h1 className='mt-16 lg:mt-36 md:mt-24 text-xl mb-4 font-bold text-gray-400'>Welcome! Say Hello 👋</h1>
      <input className='p-4 rounded border-2 lg:w-1/3 md:w-full w-3/4' type="text" onChange={handleMessageChange} placeholder='Enter your message' value={message} required />
      <button className='bg-purple-400 p-4 mt-4 lg:w-1/3 md:w-1/2 w-3/4 rounded' onClick={async () => {
        if (!isEdit) {
          await sendGreeting();
        } else {
          await updateMessage(id);
        }
      }}>
        {loading ? "Sending message please wait... 💁‍♀️" : isEdit ? 'Update' : "Send"}
      </button>
      {fetching && (<p className='mt-4 text-gray-400'>Fetching data...</p>)}

      {listMessages && listMessages.length === 0 ? "" :
        (
          <div>
            <p className="my-4 font-bold text-gray-400">Output</p>
            <TableContainer className='border'>
              <Table variant='simple'>
                <TableCaption onClick={async () => {
                  try {
                    await createOrUpdateRequest(signer, 'greetings', "DELETE");
                    successAlert("Successfully deleted");
                    await getGreetings();
                  } catch (error) {
                    errorAlert(error);
                  }

                }} textColor={"purple"} paddingBottom={"24px"} className='text-red-400'>Delete all messages</TableCaption>
                <Thead>
                  <Tr className='flex justify-between'>
                    <Th>S/N</Th>
                    <Th>Message</Th>
                    <Th>Remove</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {listMessages.map((item: any, index: any) => (
                    <Tr key={index} className='mb-2  flex justify-between'>
                      <Td className='text-gray-400'>{item.id}</Td>
                      <Td onClick={async () => {
                        try {
                          setId(item.id);
                          setEdit(true);
                          setMessage(item.message);
                        } catch (error) {
                          errorAlert(error);
                        }
                      }} className='text-gray-400'>{item.message}</Td>
                      <Td onClick={async () => {
                        try {
                          await createOrUpdateRequest(signer, `greetings/${item.id}`, "DELETE");
                          successAlert("Successfully deleted");
                          await getGreetings();
                        } catch (error) {
                          errorAlert(error);
                        }
                      }} className='bg-red-400 rounded p-4'>🗑️</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        )}
    </div>
  );
}
