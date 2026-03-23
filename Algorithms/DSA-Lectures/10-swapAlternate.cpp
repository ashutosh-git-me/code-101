#include<iostream>
using namespace std;

void swapAlt(int arr[], int size){
    for(int i=0; i<size; i+=2){
        if(i+1<size){
             swap(arr[i], arr[i+1]);
        }
    }
}
void printArray(int arr[], int size){
    cout<<"Printing Array: ";
    for(int i=0; i<size; i++){
        cout<<arr[i]<<" ";
    }
}

int main()
{
    int odd[7]={2,1,4,3,6,5,8};
    int even[8]={2,1,4,3,6,5,8,7};
    swapAlt(odd, 7);
    swapAlt(even, 8);
    printArray(odd, 7);
    printArray(even, 8);
    return 0;
}